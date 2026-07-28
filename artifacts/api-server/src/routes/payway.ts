import { Router, type IRouter } from "express";
import { eq, and, lt } from "drizzle-orm";
import { db, ordersTable, bookingsTable, paywayTransactionsTable, paywayWebhookLogsTable } from "@workspace/db";
import {
  CreateTransactionBody,
  CreateTransactionResponse,
  GetTransactionStatusParams,
  GetTransactionStatusResponse,
  RetryTransactionParams,
  RetryTransactionResponse,
} from "@workspace/api-zod";
import {
  createTransaction,
  checkTransaction,
  verifyWebhookSignature,
  generateAbaTransactionId,
} from "../lib/paywayClient";
import { sendOrderConfirmation, sendBookingConfirmation } from "../lib/email";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const KHR_PER_USD = Number(process.env.KHR_PER_USD ?? 4100);
const QR_TTL_MS = 15 * 60 * 1000; // 15 minutes

// ---------------------------------------------------------------------------
// POST /payway/create-transaction
// ---------------------------------------------------------------------------
router.post("/payway/create-transaction", async (req, res): Promise<void> => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { orderId, bookingId } = parsed.data;
  if (!orderId && !bookingId) {
    res.status(400).json({ error: "Provide either orderId or bookingId" });
    return;
  }

  // Look up the order/booking
  let amountUsd: number;
  let amountKhr: number;
  let description: string;
  let returnParam: string;

  if (orderId) {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    if (order.status === "paid") { res.status(409).json({ error: "Order is already paid" }); return; }
    amountUsd = Number(order.amountUsd);
    amountKhr = Number(order.amountKhr);
    description = "Mixing & Mastering";
    returnParam = `order:${orderId}`;
  } else {
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId!));
    if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
    if (booking.status === "paid") { res.status(409).json({ error: "Booking is already paid" }); return; }
    amountUsd = Number(booking.amountUsd);
    amountKhr = Number(booking.amountKhr);
    description = "Virtual Music Consultation";
    returnParam = `booking:${bookingId}`;
  }

  const abaTransactionId = generateAbaTransactionId();
  const expiresAt = new Date(Date.now() + QR_TTL_MS);

  // Call ABA PayWay API (or simulate in development)
  let qrImage = "";
  try {
    const result = await createTransaction({
      tranId: abaTransactionId,
      amount: amountUsd.toFixed(2),
      currency: "USD",
      description,
      returnParam,
    });
    qrImage = result.qrImage;
  } catch (err) {
    logger.error({ err }, "PayWay createTransaction failed");

    if (!process.env.ABA_PAYWAY_MERCHANT_ID) {
      // Dev mode: simulate a placeholder QR
      qrImage = `data:image/svg+xml;base64,${Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="#1a1a1a"/>
          <text x="100" y="90" text-anchor="middle" fill="#d4a444" font-family="monospace" font-size="12">SANDBOX QR</text>
          <text x="100" y="110" text-anchor="middle" fill="#d4a444" font-family="monospace" font-size="10">${abaTransactionId}</text>
          <text x="100" y="130" text-anchor="middle" fill="#888" font-family="monospace" font-size="9">$${amountUsd.toFixed(2)} USD</text>
        </svg>`
      ).toString("base64")}`;
    } else {
      res.status(502).json({ error: "Payment gateway unavailable — please try again" });
      return;
    }
  }

  // Persist transaction record
  const [txn] = await db
    .insert(paywayTransactionsTable)
    .values({
      orderId: orderId ?? null,
      bookingId: bookingId ?? null,
      abaTransactionId,
      status: "pending",
      qrImage,
      amountUsd: String(amountUsd),
      amountKhr: String(amountKhr),
      currency: "USD",
      expiresAt,
    })
    .returning();

  req.log.info({ transactionId: txn.id, abaTransactionId }, "PayWay transaction created");

  res.status(201).json(
    CreateTransactionResponse.parse({
      transactionId: txn.id,
      qrImage,
      expiresAt: txn.expiresAt,
      amountUsd,
      amountKhr,
    })
  );
});

// ---------------------------------------------------------------------------
// GET /payway/transaction-status/:transactionId
// ---------------------------------------------------------------------------
router.get("/payway/transaction-status/:transactionId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.transactionId) ? req.params.transactionId[0] : req.params.transactionId;
  const params = GetTransactionStatusParams.safeParse({ transactionId: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [txn] = await db
    .select()
    .from(paywayTransactionsTable)
    .where(eq(paywayTransactionsTable.id, params.data.transactionId));

  if (!txn) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }

  let status = txn.status;

  // If still pending and not expired, poll ABA
  if (status === "pending") {
    const now = new Date();
    if (txn.expiresAt < now) {
      // Mark expired
      await db
        .update(paywayTransactionsTable)
        .set({ status: "expired" })
        .where(eq(paywayTransactionsTable.id, txn.id));
      status = "expired";
    } else if (process.env.ABA_PAYWAY_MERCHANT_ID) {
      // Poll ABA API
      try {
        const check = await checkTransaction(txn.abaTransactionId);
        if (check.status === 1) {
          status = "paid";
          await markAsPaid(txn);
        } else if (check.status === 2) {
          status = "failed";
          await db
            .update(paywayTransactionsTable)
            .set({ status: "failed" })
            .where(eq(paywayTransactionsTable.id, txn.id));
        }
      } catch (err) {
        req.log.warn({ err }, "PayWay check-transaction polling error (non-fatal)");
      }
    }
  }

  res.json(
    GetTransactionStatusResponse.parse({
      transactionId: txn.id,
      status,
      orderId: txn.orderId ?? undefined,
      bookingId: txn.bookingId ?? undefined,
      expiresAt: txn.expiresAt,
    })
  );
});

// ---------------------------------------------------------------------------
// POST /payway/callback  (ABA webhook)
// ---------------------------------------------------------------------------
router.post("/payway/callback", async (req, res): Promise<void> => {
  // ABA sends form data as application/x-www-form-urlencoded
  const body = req.body as Record<string, string>;

  const tranId = body.tran_id ?? "";
  const apv = body.apv ?? "";
  const bankCode = body.bank_code ?? "";
  const status = body.status ?? "";
  const merchantId = body.merchant_id ?? "";
  const hash = body.hash ?? "";

  req.log.info({ tranId, status }, "PayWay webhook received");

  // 1. Verify HMAC signature (only when configured — skip in dev)
  if (process.env.ABA_PAYWAY_MERCHANT_ID) {
    const valid = verifyWebhookSignature({ tranId, apv, bankCode, status, merchantId, hash });
    if (!valid) {
      req.log.warn({ tranId }, "PayWay webhook: invalid signature");
      res.status(400).json({ error: "Invalid signature" });
      return;
    }
  }

  // 2. Idempotency: ignore duplicate webhook deliveries
  try {
    await db.insert(paywayWebhookLogsTable).values({
      abaTransactionId: tranId,
      payload: JSON.stringify(body),
    });
  } catch {
    // Unique constraint violation = duplicate; respond 200 to stop ABA retrying
    req.log.info({ tranId }, "PayWay webhook: duplicate — already processed");
    res.json({ received: true });
    return;
  }

  // 3. Find transaction
  const [txn] = await db
    .select()
    .from(paywayTransactionsTable)
    .where(eq(paywayTransactionsTable.abaTransactionId, tranId));

  if (!txn) {
    req.log.warn({ tranId }, "PayWay webhook: unknown transaction");
    res.status(404).json({ error: "Unknown transaction" });
    return;
  }

  // 4. Update status if paid
  if (status === "1" || status === "00" || apv) {
    await markAsPaid(txn);
  }

  res.json({ received: true });
});

// ---------------------------------------------------------------------------
// POST /payway/retry/:transactionId
// ---------------------------------------------------------------------------
router.post("/payway/retry/:transactionId", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.transactionId) ? req.params.transactionId[0] : req.params.transactionId;
  const params = RetryTransactionParams.safeParse({ transactionId: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [txn] = await db
    .select()
    .from(paywayTransactionsTable)
    .where(eq(paywayTransactionsTable.id, params.data.transactionId));

  if (!txn) { res.status(404).json({ error: "Transaction not found" }); return; }

  // Only allow retry if expired or failed
  if (txn.status !== "expired" && txn.status !== "failed") {
    res.status(409).json({ error: `Cannot retry a ${txn.status} transaction` });
    return;
  }

  // Look up order/booking for description
  let description = "TosConnect Service";
  if (txn.orderId) {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, txn.orderId));
    if (order?.status === "paid") { res.status(409).json({ error: "Order is already paid" }); return; }
    description = "Mixing & Mastering";
  } else if (txn.bookingId) {
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, txn.bookingId!));
    if (booking?.status === "paid") { res.status(409).json({ error: "Booking is already paid" }); return; }
    description = "Virtual Music Consultation";
  }

  const abaTransactionId = generateAbaTransactionId();
  const expiresAt = new Date(Date.now() + QR_TTL_MS);
  const amountUsd = Number(txn.amountUsd);
  const returnParam = txn.orderId ? `order:${txn.orderId}` : `booking:${txn.bookingId}`;

  let qrImage = "";
  try {
    const result = await createTransaction({
      tranId: abaTransactionId,
      amount: amountUsd.toFixed(2),
      currency: "USD",
      description,
      returnParam,
    });
    qrImage = result.qrImage;
  } catch (err) {
    logger.error({ err }, "PayWay retry createTransaction failed");
    if (!process.env.ABA_PAYWAY_MERCHANT_ID) {
      qrImage = `data:image/svg+xml;base64,${Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#1a1a1a"/><text x="100" y="100" text-anchor="middle" fill="#d4a444" font-family="monospace" font-size="12">RETRY QR ${abaTransactionId}</text></svg>`
      ).toString("base64")}`;
    } else {
      res.status(502).json({ error: "Payment gateway unavailable" });
      return;
    }
  }

  const [newTxn] = await db
    .insert(paywayTransactionsTable)
    .values({
      orderId: txn.orderId,
      bookingId: txn.bookingId,
      abaTransactionId,
      status: "pending",
      qrImage,
      amountUsd: txn.amountUsd,
      amountKhr: txn.amountKhr,
      currency: txn.currency,
      expiresAt,
    })
    .returning();

  res.status(201).json(
    RetryTransactionResponse.parse({
      transactionId: newTxn.id,
      qrImage,
      expiresAt: newTxn.expiresAt,
      amountUsd: Number(newTxn.amountUsd),
      amountKhr: Number(newTxn.amountKhr),
    })
  );
});

// ---------------------------------------------------------------------------
// Shared: mark a transaction + its order/booking as paid, send email
// ---------------------------------------------------------------------------
async function markAsPaid(txn: { id: string; abaTransactionId: string; orderId: string | null; bookingId: string | null; status: string; amountUsd: string; amountKhr: string }): Promise<void> {
  if (txn.status === "paid") return;

  await db
    .update(paywayTransactionsTable)
    .set({ status: "paid" })
    .where(eq(paywayTransactionsTable.id, txn.id));

  if (txn.orderId) {
    const [updated] = await db
      .update(ordersTable)
      .set({ status: "paid", paymentRef: txn.abaTransactionId })
      .where(and(eq(ordersTable.id, txn.orderId), eq(ordersTable.status, "pending")))
      .returning();

    if (updated) {
      sendOrderConfirmation({
        orderId: updated.id,
        customerName: updated.customerName,
        email: updated.email,
        details: updated.details,
        amountUsd: updated.amountUsd,
        amountKhr: updated.amountKhr,
      }).catch(() => {});
    }
  } else if (txn.bookingId) {
    const [updated] = await db
      .update(bookingsTable)
      .set({ status: "paid", paymentRef: txn.abaTransactionId })
      .where(and(eq(bookingsTable.id, txn.bookingId), eq(bookingsTable.status, "pending")))
      .returning();

    if (updated) {
      sendBookingConfirmation({
        bookingId: updated.id,
        customerName: updated.customerName,
        email: updated.email,
        sessionTopic: updated.sessionTopic,
        preferredTimes: updated.preferredTimes,
        amountUsd: updated.amountUsd,
        amountKhr: updated.amountKhr,
      }).catch(() => {});
    }
  }

  logger.info({ transactionId: txn.id, abaTransactionId: txn.abaTransactionId }, "PayWay transaction marked paid");
}

export default router;
