import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import {
  CreateOrderBody,
  CreateOrderResponse,
  TrackOrderParams,
  TrackOrderBody,
  TrackOrderResponse,
} from "@workspace/api-zod";
import { sendOrderConfirmation } from "../lib/email";

const router: IRouter = Router();

// POST /orders — create a new mixing order
router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { customerName, email, details, stemsUrls, amountUsd, amountKhr } = parsed.data;

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName,
      email,
      serviceType: "mixing_mastering",
      details,
      stemsUrls: stemsUrls ?? [],
      status: "pending",
      amountUsd: String(amountUsd),
      amountKhr: String(amountKhr),
    })
    .returning();

  req.log.info({ orderId: order.id }, "Order created");

  // Send confirmation email (non-blocking)
  sendOrderConfirmation({
    orderId: order.id,
    customerName: order.customerName,
    email: order.email,
    details: order.details,
    amountUsd: order.amountUsd,
    amountKhr: order.amountKhr,
  }).catch(() => {});

  res.status(201).json(
    CreateOrderResponse.parse({
      ...order,
      amountUsd: Number(order.amountUsd),
      amountKhr: Number(order.amountKhr),
    })
  );
});

// POST /orders/:id/track — customer order tracking
router.post("/orders/:id/track", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = TrackOrderParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = TrackOrderBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.id, params.data.id),
        eq(ordersTable.email, body.data.email)
      )
    );

  if (!order) {
    res.status(404).json({ error: "Order not found — please check your order ID and email" });
    return;
  }

  res.json(
    TrackOrderResponse.parse({
      id: order.id,
      status: order.status,
      serviceType: order.serviceType,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      notes: order.notes,
    })
  );
});

export default router;
