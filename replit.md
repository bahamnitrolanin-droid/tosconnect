# TosConnect

A premium professional audio services e-commerce platform for Phnom Penh-based music producer Tos Connect. Offers two services to Cambodia's creator economy — Audio Mixing & Mastering and 1-on-1 Virtual Music Consultations — with ABA PayWay KHQR payment integration.

## Run & Operate

- `pnpm --filter @workspace/tosconnect run dev` — run the frontend (port assigned by artifact)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required env vars

- `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)
- `SESSION_SECRET` — JWT signing secret for admin tokens (already set)
- `ADMIN_PASSWORD` — Admin dashboard passphrase (**must be set before using /admin**)
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID` — GCS bucket for stem file uploads (auto-set)
- `PUBLIC_OBJECT_SEARCH_PATHS` — Object storage public paths (auto-set)
- `PRIVATE_OBJECT_DIR` — Object storage private dir (auto-set)

### Optional (email notifications — skipped gracefully if not set)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — SMTP credentials
- `SMTP_FROM` — From address (defaults to SMTP_USER)
- `ADMIN_EMAIL` — Email to notify when new orders/bookings arrive
- `SMTP_SECURE` — Set to `"true"` for port 465 TLS

### ABA PayWay KHQR (Task #2)
- `ABA_PAYWAY_MERCHANT_ID` — From ABA PayWay merchant portal
- `ABA_PAYWAY_API_KEY` — From ABA PayWay merchant portal
- `ABA_PAYWAY_WEBHOOK_SECRET` — For verifying callback authenticity
- `ABA_PAYWAY_ENV` — `sandbox` or `production`
- `KHR_PER_USD` — Exchange rate (default: 4100)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TanStack Query, Wouter, Tailwind CSS, Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (v3 for api-zod, v4 for db schema)
- API codegen: Orval (from OpenAPI spec)
- File uploads: Replit Object Storage (GCS-backed presigned URLs)
- Auth: JWT signed with SESSION_SECRET for admin
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — single source of truth for all API contracts
- `lib/db/src/schema/orders.ts` — orders table (mixing & mastering)
- `lib/db/src/schema/bookings.ts` — bookings table (consultations)
- `artifacts/api-server/src/routes/orders.ts` — order creation & tracking
- `artifacts/api-server/src/routes/bookings.ts` — consultation booking
- `artifacts/api-server/src/routes/admin.ts` — admin dashboard API (JWT-protected)
- `artifacts/api-server/src/routes/storage.ts` — presigned URL file upload endpoints
- `artifacts/api-server/src/lib/email.ts` — email notifications (gracefully skipped if SMTP not set)
- `artifacts/api-server/src/middlewares/adminAuth.ts` — JWT bearer token middleware
- `artifacts/tosconnect/src/` — React frontend
- `lib/api-client-react/src/custom-fetch.ts` — includes admin JWT auth header injection

## Architecture decisions

- Admin auth is a simple JWT bearer token (stored in localStorage) verified on every admin route. No sessions, no cookies. Simple enough for a solo operator.
- Amounts stored as `numeric` strings in Postgres, converted to `number` when serialized to API responses. Avoids floating-point issues with money.
- Email notifications fail silently if SMTP is not configured — the API still returns 201. This allows development without email setup.
- File upload uses presigned GCS URLs (two-step: request URL → PUT directly to GCS). Files are never proxied through the Express server.
- All service prices hardcoded in frontend: Mixing $80 / 328,000 ៛, Consultation $40 / 164,000 ៛.

## Product

**Services offered:**
1. **Audio Mixing & Mastering** — $80 USD / 328,000 ៛ — client uploads stems, receives mixed & mastered track in 3–5 business days
2. **1-on-1 Virtual Music Consultation** — $40 USD / 164,000 ៛ — 1-hour Zoom/Meet session on production, distribution, or songwriting

**ABA Bank compliance features:**
- Dual USD + KHR pricing shown everywhere
- Refund Policy, Delivery Policy, T&C (with ABA PayWay payment clause), Privacy Policy pages
- Footer with physical address (Phnom Penh), support email, phone placeholder

## User preferences

- Brand tagline: "Where Music Meets Soul"
- Target market: Cambodia's creator economy
- Payment gateway: ABA Bank PayWay KHQR (Task #2 for integration)
- Apply via: paywaysales@ababank.com — describe as "e-commerce platform selling professional audio services with 100% digital fulfilment"

## Gotchas

- ADMIN_PASSWORD must be set before the /admin route works. Without it, all admin login attempts return 500.
- `pnpm --filter @workspace/db run push-force` if push fails with column conflicts.
- Do not use `type: integer` or `format: email`/`format: uri` in openapi.yaml — Orval generates Zod v4 syntax (`.int()`, `.email()`, `.url()`) which doesn't exist in Zod v3. Use `type: number` and plain `type: string` instead.
- Orval generates `{OperationIdPascal}Response` for response Zod schemas automatically — do NOT name component schemas with that pattern or you get TS2308 collisions in lib/api-zod.
- Array columns in Drizzle: use `.array()` as a method — `text("col").array()`, not `array(text("col"))`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
