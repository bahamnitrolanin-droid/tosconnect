import { pgTable, text, numeric, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bookingsTable = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  sessionTopic: text("session_topic").notNull(),
  preferredTimes: text("preferred_times").array().notNull().default([]),
  status: text("status").notNull().default("pending"),
  zoomLink: text("zoom_link"),
  amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
  amountKhr: numeric("amount_khr", { precision: 12, scale: 0 }).notNull(),
  paymentRef: text("payment_ref"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
