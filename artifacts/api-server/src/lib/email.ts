import { logger } from "./logger";

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  email: string;
  details: string;
  amountUsd: string;
  amountKhr: string;
}

interface BookingConfirmationData {
  bookingId: string;
  customerName: string;
  email: string;
  sessionTopic: string;
  preferredTimes: string[];
  amountUsd: string;
  amountKhr: string;
}

function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

async function getTransporter() {
  if (!isEmailConfigured()) return null;
  const nodemailer = await import("nodemailer");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    logger.info({ orderId: data.orderId }, "Email not configured — skipping order confirmation email");
    return;
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER;

  try {
    // Customer email
    await transporter.sendMail({
      from,
      to: data.email,
      subject: `Order Confirmed — TosConnect #${data.orderId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 32px;">
          <h1 style="color: #d4a444; margin-bottom: 8px;">TosConnect</h1>
          <p style="color: #999; margin-bottom: 24px;">Where Music Meets Soul</p>
          <h2>Order Confirmed</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your mixing & mastering order has been received. Here are your order details:</p>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Project Details:</strong> ${data.details}</p>
            <p><strong>Amount:</strong> $${data.amountUsd} USD / ${data.amountKhr} ៛</p>
          </div>
          <p>We will send you KHQR payment instructions shortly. Once payment is confirmed, we'll start working on your tracks within 1 business day.</p>
          <p>Expected delivery: <strong>3–5 business days</strong> after payment confirmation.</p>
          <p>Questions? Reply to this email or contact <a href="mailto:support@tosconnect.com" style="color: #d4a444;">support@tosconnect.com</a></p>
          <hr style="border-color: #333; margin: 24px 0;" />
          <p style="color: #666; font-size: 12px;">TosConnect | Phnom Penh, Cambodia | support@tosconnect.com</p>
        </div>
      `,
    });

    // Admin notification
    if (adminEmail) {
      await transporter.sendMail({
        from,
        to: adminEmail,
        subject: `[TosConnect] New Mixing Order #${data.orderId.slice(0, 8).toUpperCase()} from ${data.customerName}`,
        html: `
          <p><strong>New order received</strong></p>
          <p><strong>Order ID:</strong> ${data.orderId}</p>
          <p><strong>Customer:</strong> ${data.customerName} (${data.email})</p>
          <p><strong>Details:</strong> ${data.details}</p>
          <p><strong>Amount:</strong> $${data.amountUsd} USD / ${data.amountKhr} ៛</p>
        `,
      });
    }

    logger.info({ orderId: data.orderId, to: data.email }, "Order confirmation email sent");
  } catch (err) {
    logger.error({ err, orderId: data.orderId }, "Failed to send order confirmation email");
  }
}

export async function sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
  const transporter = await getTransporter();
  if (!transporter) {
    logger.info({ bookingId: data.bookingId }, "Email not configured — skipping booking confirmation email");
    return;
  }

  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_EMAIL ?? process.env.SMTP_USER;

  try {
    await transporter.sendMail({
      from,
      to: data.email,
      subject: `Consultation Booked — TosConnect #${data.bookingId.slice(0, 8).toUpperCase()}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; padding: 32px;">
          <h1 style="color: #d4a444; margin-bottom: 8px;">TosConnect</h1>
          <p style="color: #999; margin-bottom: 24px;">Where Music Meets Soul</p>
          <h2>Consultation Booked</h2>
          <p>Hi ${data.customerName},</p>
          <p>Your 1-on-1 music consultation has been booked. Here are your details:</p>
          <div style="background: #1a1a1a; border: 1px solid #333; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <p><strong>Booking ID:</strong> ${data.bookingId}</p>
            <p><strong>Topic:</strong> ${data.sessionTopic}</p>
            <p><strong>Preferred Times:</strong> ${data.preferredTimes.join(", ")}</p>
            <p><strong>Amount:</strong> $${data.amountUsd} USD / ${data.amountKhr} ៛</p>
          </div>
          <p>We will send you KHQR payment instructions shortly. Once payment is confirmed, you'll receive a Zoom/Google Meet link within 24 hours.</p>
          <p>Questions? Contact <a href="mailto:support@tosconnect.com" style="color: #d4a444;">support@tosconnect.com</a></p>
          <hr style="border-color: #333; margin: 24px 0;" />
          <p style="color: #666; font-size: 12px;">TosConnect | Phnom Penh, Cambodia | support@tosconnect.com</p>
        </div>
      `,
    });

    if (adminEmail) {
      await transporter.sendMail({
        from,
        to: adminEmail,
        subject: `[TosConnect] New Consultation Booking #${data.bookingId.slice(0, 8).toUpperCase()} from ${data.customerName}`,
        html: `
          <p><strong>New booking received</strong></p>
          <p><strong>Booking ID:</strong> ${data.bookingId}</p>
          <p><strong>Customer:</strong> ${data.customerName} (${data.email})</p>
          <p><strong>Topic:</strong> ${data.sessionTopic}</p>
          <p><strong>Preferred Times:</strong> ${data.preferredTimes.join(", ")}</p>
          <p><strong>Amount:</strong> $${data.amountUsd} USD / ${data.amountKhr} ៛</p>
        `,
      });
    }

    logger.info({ bookingId: data.bookingId, to: data.email }, "Booking confirmation email sent");
  } catch (err) {
    logger.error({ err, bookingId: data.bookingId }, "Failed to send booking confirmation email");
  }
}
