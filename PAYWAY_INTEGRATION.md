# ABA PayWay KHQR Integration Guide

TosConnect uses ABA Bank's PayWay KHQR gateway for all payments.  
This document covers: environment setup, the sandbox test flow, the production promotion checklist, and webhook payload details.

---

## Environment Variables

Set these in Replit Secrets before going live:

| Variable | Description | Example |
|---|---|---|
| `ABA_PAYWAY_MERCHANT_ID` | Issued by ABA PayWay portal | `abc123` |
| `ABA_PAYWAY_API_KEY` | HMAC signing key from portal | `long_hex_string` |
| `ABA_PAYWAY_WEBHOOK_SECRET` | Reserved for future use | same as API key |
| `ABA_PAYWAY_ENV` | `sandbox` or `production` | `sandbox` |
| `KHR_PER_USD` | Exchange rate (default 4100) | `4100` |

Apply for credentials by emailing **paywaysales@ababank.com** with:
- Business name: TosConnect
- Business type: E-commerce — professional audio services (100% digital fulfilment)
- Callback URL: `https://<your-domain>/api/payway/callback`

---

## API Endpoints (backend)

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/payway/create-transaction` | Public | Create KHQR transaction, returns QR image |
| `GET` | `/api/payway/transaction-status/:id` | Public | Poll payment status |
| `POST` | `/api/payway/callback` | None (HMAC verified) | ABA webhook receiver |
| `POST` | `/api/payway/retry/:id` | Public | Generate new QR for expired transaction |

---

## Payment Flow (frontend)

```
Customer form submit
  ↓
POST /api/orders  or  POST /api/bookings
  ↓
POST /api/payway/create-transaction  { orderId / bookingId }
  ↓  returns { transactionId, qrImage, expiresAt, amountUsd, amountKhr }
Store in sessionStorage, navigate to /checkout/:transactionId
  ↓
Checkout page polls GET /api/payway/transaction-status/:transactionId  every 3s
  ↓  status = "paid"
Redirect → /order-confirmed/order/:orderId  or  /order-confirmed/booking/:bookingId
```

---

## HMAC-SHA512 Hash Algorithm

### Purchase (`POST /payments/purchase`)

```
hashInput = req_time + merchant_id + tran_id + amount + currency + user_id + items
hash = base64( HMAC-SHA512( api_key, hashInput ) )
```

- `req_time` = UTC timestamp `YYYYMMDDHHmmss`
- `amount` = decimal string e.g. `"80.00"`
- `currency` = `"USD"` or `"KHR"`
- `user_id` = empty string (no user accounts)
- `items` = URL-encoded JSON array: `[{"name":"Mixing & Mastering","quantity":1,"price":"80.00"}]`

### Check Transaction (`POST /payments/check-transaction`)

```
hashInput = req_time + merchant_id + tran_id
hash = base64( HMAC-SHA512( api_key, hashInput ) )
```

### Webhook Callback Verification

ABA sends `hash` in the callback. Verify:

```
hashInput = tran_id + apv + bank_code + status + merchant_id
expected = base64( HMAC-SHA512( api_key, hashInput ) )
valid = (expected === received_hash)
```

---

## Sandbox Setup

1. Set `ABA_PAYWAY_ENV=sandbox` in Replit Secrets
2. Set `ABA_PAYWAY_MERCHANT_ID` and `ABA_PAYWAY_API_KEY` from sandbox portal
3. Restart the API server workflow
4. Submit a test order through `/services/mixing-mastering`
5. The checkout page will display a live sandbox QR code

### Testing with ABA Sandbox Scanner

1. Download the **ABA PayWay Sandbox** app (provided by ABA — ask your merchant manager)
2. Or use the sandbox web scanner at `https://checkout-sandbox.payway.com.kh/test-scanner`
3. Scan the KHQR on the checkout page
4. Approve the payment — the checkout page auto-redirects to the confirmation page

### Simulated QR (no credentials)

When `ABA_PAYWAY_MERCHANT_ID` is **not set**, the backend returns a placeholder SVG QR image and skips HMAC verification. This lets you develop and test the UI flow without real credentials.

---

## Webhook Callback Format

ABA sends `application/x-www-form-urlencoded` POST to `/api/payway/callback`:

```
tran_id=TOS1A2B3C4D5E&apv=123456&bank_code=ABA&status=1&merchant_id=abc123&hash=base64...
```

| Field | Description |
|---|---|
| `tran_id` | Your transaction ID (the `abaTransactionId` you sent) |
| `apv` | Approval code |
| `bank_code` | Paying bank (e.g. `ABA`, `WING`, `PI`) |
| `status` | `1` = paid, `0` = pending, `2` = failed |
| `hash` | Verification signature |

**Idempotency:** The backend rejects duplicate webhook deliveries using the `payway_webhook_logs` table (unique index on `tran_id`).

---

## Transaction Expiry

- KHQR expires after **15 minutes** (`QR_TTL_MS = 15 * 60 * 1000`)
- The polling endpoint automatically marks transactions `expired` if `expires_at` has passed
- Customers can generate a fresh QR via the **"Generate New QR"** button (calls `POST /api/payway/retry/:transactionId`)
- A new `payway_transactions` record is created for each retry; the original record remains for audit

---

## Production Checklist

Before switching `ABA_PAYWAY_ENV=production`:

- [ ] HTTPS confirmed (Replit deployment = automatic HTTPS ✓)
- [ ] Callback URL registered in ABA PayWay merchant portal as `https://<domain>/api/payway/callback`
- [ ] `ADMIN_PASSWORD` set in Replit Secrets
- [ ] Test full payment flow with sandbox credentials
- [ ] Email notifications working (`SMTP_*` variables configured)
- [ ] Switch `ABA_PAYWAY_ENV` to `production`
- [ ] Replace sandbox credentials with production credentials
- [ ] Place a live test transaction for $1 USD

---

## Database Tables

### `payway_transactions`

| Column | Type | Description |
|---|---|---|
| `id` | uuid | Internal transaction ID (used in URLs) |
| `aba_transaction_id` | text | Short ID sent to ABA (e.g. `TOS1A2B3C4D`) |
| `order_id` | uuid? | FK → orders |
| `booking_id` | uuid? | FK → bookings |
| `status` | text | `pending` / `paid` / `expired` / `failed` |
| `qr_image` | text | Base64 data URL of the KHQR QR code PNG |
| `amount_usd` | numeric | Amount in USD |
| `amount_khr` | numeric | Amount in KHR |
| `expires_at` | timestamp | 15 min after creation |

### `payway_webhook_logs`

Stores processed webhooks for idempotency.  
Unique index on `aba_transaction_id` prevents duplicate processing.
