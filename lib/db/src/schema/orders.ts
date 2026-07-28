import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  serviceType: text("service_type").notNull().default("mixing_mastering"),
  details: text("details").notNull(),
  stemsUrls: text("stems_urls").array().notNull().default([]),
  status: text("status").notNull().default("pending"),
  amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
  amountKhr: numeric("amount_khr", { precision: 12, scale: 0 }).notNull(),
  paymentRef: text("payment_ref"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
