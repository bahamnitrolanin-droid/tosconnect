import { pgTable, text, numeric, timestamp, uuid, index, uniqueIndex } from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";
import { bookingsTable } from "./bookings";

export const paywayTransactionsTable = pgTable(
  "payway_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").references(() => ordersTable.id),
    bookingId: uuid("booking_id").references(() => bookingsTable.id),
    /** ABA PayWay transaction ID (short alphanumeric, sent to ABA) */
    abaTransactionId: text("aba_transaction_id").notNull().unique(),
    status: text("status").notNull().default("pending"), // pending | paid | expired | failed
    qrImage: text("qr_image"), // base64 data URL from ABA
    amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
    amountKhr: numeric("amount_khr", { precision: 12, scale: 0 }).notNull(),
    currency: text("currency").notNull().default("USD"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("payway_transactions_order_id_idx").on(table.orderId),
    index("payway_transactions_booking_id_idx").on(table.bookingId),
    index("payway_transactions_status_idx").on(table.status),
  ]
);

export const paywayWebhookLogsTable = pgTable(
  "payway_webhook_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    abaTransactionId: text("aba_transaction_id").notNull(),
    payload: text("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("payway_webhook_logs_tran_id_idx").on(table.abaTransactionId),
  ]
);

export type PaywayTransaction = typeof paywayTransactionsTable.$inferSelect;
export type PaywayWebhookLog = typeof paywayWebhookLogsTable.$inferSelect;
