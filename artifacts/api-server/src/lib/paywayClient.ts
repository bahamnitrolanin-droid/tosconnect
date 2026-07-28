/**
 * ABA PayWay KHQR API Client
 *
 * Reference: https://developer.payway.com.kh/
 * API Version: v1
 *
 * Hash algorithm: HMAC-SHA512 over a concatenated string of specific request
 * fields (in documented order), base64-encoded. Key = ABA_PAYWAY_API_KEY.
 */

import { createHmac, randomBytes } from "crypto";
import { logger } from "./logger";

const SANDBOX_BASE = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1";
const PRODUCTION_BASE = "https://checkout.payway.com.kh/api/payment-gateway/v1";

function getBaseUrl(): string {
  return process.env.ABA_PAYWAY_ENV === "production" ? PRODUCTION_BASE : SANDBOX_BASE;
}

function getMerchantId(): string {
  return process.env.ABA_PAYWAY_MERCHANT_ID ?? "";
}

function getApiKey(): string {
  return process.env.ABA_PAYWAY_API_KEY ?? "";
}

function isConfigured(): boolean {
  return !!(process.env.ABA_PAYWAY_MERCHANT_ID && process.env.ABA_PAYWAY_API_KEY);
}

/** Format a Date as YYYYMMDDHHmmss (UTC) */
function fmtReqTime(date: Date): string {
  const p = (n: number, w = 2) => String(n).padStart(w, "0");
  return (
    date.getUTCFullYear() +
    p(date.getUTCMonth() + 1) +
    p(date.getUTCDate()) +
    p(date.getUTCHours()) +
    p(date.getUTCMinutes()) +
    p(date.getUTCSeconds())
  );
}

/** Generate a short unique transaction ID safe for ABA (max 20 chars) */
export function generateAbaTransactionId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = randomBytes(3).toString("hex").toUpperCase();
  return `TOS${ts}${rand}`.slice(0, 20);
}

/** HMAC-SHA512 → base64 */
function hmac512(key: string, data: string): string {
  return createHmac("sha512", key).update(data).digest("base64");
}

export interface PurchaseRequest {
  tranId: string;
  amount: string;        // decimal string, e.g. "80.00"
  currency: string;      // "USD" or "KHR"
  description: string;
  returnParam: string;   // opaque string echoed back in callback
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}

export interface PurchaseResponse {
  status: number;
  description: string;
  qrImage: string;     // base64 PNG QR code data URL
  qrString?: string;   // raw KHQR string (optional, for custom rendering)
  abaTransactionId: string;
}

export interface CheckTransactionResponse {
  status: number;      // 0 = pending, 1 = paid, 2 = failed/cancelled
  description: string;
  abaTransactionId: string;
  apv?: string;        // Approval code when paid
}

/**
 * Create a KHQR payment transaction with ABA PayWay.
 *
 * Docs: POST /payments/purchase
 * Hash input: req_time + merchant_id + tran_id + amount + currency + user_id + items
 * where items is URL-encoded JSON: [{"name":"...","quantity":1,"price":"..."}]
 */
export async function createTransaction(req: PurchaseRequest): Promise<PurchaseResponse> {
  if (!isConfigured()) {
    throw new Error("ABA PayWay is not configured (missing ABA_PAYWAY_MERCHANT_ID or ABA_PAYWAY_API_KEY)");
  }

  const merchantId = getMerchantId();
  const apiKey = getApiKey();
  const reqTime = fmtReqTime(new Date());

  // items: URL-encoded JSON
  const itemsJson = JSON.stringify([
    { name: req.description, quantity: 1, price: req.amount },
  ]);
  const itemsEncoded = encodeURIComponent(itemsJson);

  // Hash: req_time + merchant_id + tran_id + amount + currency + user_id + items
  const userId = ""; // no user accounts — pass empty string
  const hashInput = reqTime + merchantId + req.tranId + req.amount + req.currency + userId + itemsEncoded;
  const hash = hmac512(apiKey, hashInput);

  const body = new URLSearchParams({
    req_time: reqTime,
    merchant_id: merchantId,
    tran_id: req.tranId,
    amount: req.amount,
    currency: req.currency,
    tran_desc: req.description,
    return_param: req.returnParam,
    items: itemsEncoded,
    hash,
    ...(req.firstName && { firstname: req.firstName }),
    ...(req.lastName && { lastname: req.lastName }),
    ...(req.phone && { phone: req.phone }),
    ...(req.email && { email: req.email }),
    type: "purchase",
    payment_option: "abapay_khqr",
  });

  logger.info({ tranId: req.tranId, amount: req.amount, currency: req.currency }, "PayWay createTransaction");

  const response = await fetch(`${getBaseUrl()}/payments/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error({ status: response.status, body: text }, "PayWay purchase HTTP error");
    throw new Error(`PayWay purchase HTTP ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    status: number;
    description?: string;
    data?: {
      qr_image?: string;
      qr_string?: string;
      tran_id?: string;
      [key: string]: unknown;
    };
  };

  logger.info({ status: data.status, tranId: req.tranId }, "PayWay purchase response");

  if (data.status !== 0) {
    throw new Error(`PayWay purchase failed: ${data.description ?? "unknown error"} (status ${data.status})`);
  }

  const qrImageRaw = data.data?.qr_image ?? "";
  // Ensure it is a proper data URL
  const qrImage = qrImageRaw.startsWith("data:")
    ? qrImageRaw
    : `data:image/png;base64,${qrImageRaw}`;

  return {
    status: data.status,
    description: data.description ?? "",
    qrImage,
    qrString: data.data?.qr_string,
    abaTransactionId: req.tranId,
  };
}

/**
 * Check the status of a PayWay transaction.
 *
 * Docs: POST /payments/check-transaction
 * Hash input: req_time + merchant_id + tran_id
 */
export async function checkTransaction(abaTransactionId: string): Promise<CheckTransactionResponse> {
  if (!isConfigured()) {
    throw new Error("ABA PayWay not configured");
  }

  const merchantId = getMerchantId();
  const apiKey = getApiKey();
  const reqTime = fmtReqTime(new Date());

  const hashInput = reqTime + merchantId + abaTransactionId;
  const hash = hmac512(apiKey, hashInput);

  const body = new URLSearchParams({
    req_time: reqTime,
    merchant_id: merchantId,
    tran_id: abaTransactionId,
    hash,
  });

  const response = await fetch(`${getBaseUrl()}/payments/check-transaction`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayWay check-transaction HTTP ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    status: number;
    description?: string;
    data?: { apv?: string; [key: string]: unknown };
  };

  // ABA PayWay check-transaction status:
  // 0 = pending/not yet paid
  // 1 = paid
  // 2 = failed or cancelled

  return {
    status: data.status,
    description: data.description ?? "",
    abaTransactionId,
    apv: data.data?.apv,
  };
}

/**
 * Verify a webhook callback HMAC signature from ABA PayWay.
 *
 * ABA signs the callback with:
 * hash = base64(HMAC-SHA512(api_key, tran_id + apv + bank_code + status + merchant_id))
 */
export function verifyWebhookSignature(params: {
  tranId: string;
  apv: string;
  bankCode: string;
  status: string;
  merchantId: string;
  hash: string;
}): boolean {
  const apiKey = getApiKey();
  if (!apiKey) return false;

  const input = params.tranId + params.apv + params.bankCode + params.status + params.merchantId;
  const expected = hmac512(apiKey, input);
  return expected === params.hash;
}
