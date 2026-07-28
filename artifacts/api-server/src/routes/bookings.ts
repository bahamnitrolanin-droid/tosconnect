import { Router, type IRouter } from "express";
import { db, bookingsTable } from "@workspace/db";
import {
  CreateBookingBody,
  CreateBookingResponse,
} from "@workspace/api-zod";
import { sendBookingConfirmation } from "../lib/email";

const router: IRouter = Router();

// POST /bookings — create a new consultation booking
router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { customerName, email, sessionTopic, preferredTimes, amountUsd, amountKhr } = parsed.data;

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      customerName,
      email,
      sessionTopic,
      preferredTimes: preferredTimes ?? [],
      status: "pending",
      amountUsd: String(amountUsd),
      amountKhr: String(amountKhr),
    })
    .returning();

  req.log.info({ bookingId: booking.id }, "Booking created");

  sendBookingConfirmation({
    bookingId: booking.id,
    customerName: booking.customerName,
    email: booking.email,
    sessionTopic: booking.sessionTopic,
    preferredTimes: booking.preferredTimes,
    amountUsd: booking.amountUsd,
    amountKhr: booking.amountKhr,
  }).catch(() => {});

  res.status(201).json(
    CreateBookingResponse.parse({
      ...booking,
      amountUsd: Number(booking.amountUsd),
      amountKhr: Number(booking.amountKhr),
    })
  );
});

export default router;
