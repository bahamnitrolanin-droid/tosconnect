import { Router, type IRouter } from "express";
import { eq, count, sql } from "drizzle-orm";
import { db, ordersTable, bookingsTable } from "@workspace/db";
import jwt from "jsonwebtoken";
import {
  AdminLoginBody,
  AdminLoginResponse,
  AdminListOrdersQueryParams,
  AdminListOrdersResponse,
  AdminGetOrderParams,
  AdminGetOrderResponse,
  AdminUpdateOrderParams,
  AdminUpdateOrderBody,
  AdminUpdateOrderResponse,
  AdminListBookingsQueryParams,
  AdminListBookingsResponse,
  AdminGetBookingParams,
  AdminGetBookingResponse,
  AdminUpdateBookingParams,
  AdminUpdateBookingBody,
  AdminUpdateBookingResponse,
  AdminGetStatsResponse,
} from "@workspace/api-zod";
import { adminAuth } from "../middlewares/adminAuth";

const router: IRouter = Router();

// POST /admin/login
router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    req.log.error("ADMIN_PASSWORD env var not set");
    res.status(500).json({ error: "Admin auth not configured" });
    return;
  }

  if (parsed.data.password !== adminPassword) {
    res.status(401).json({ error: "Incorrect passphrase" });
    return;
  }

  const secret = process.env.SESSION_SECRET!;
  const token = jwt.sign({ role: "admin" }, secret, { expiresIn: "7d" });

  res.json(AdminLoginResponse.parse({ token }));
});

// All routes below require admin auth
router.use("/admin", adminAuth);

// GET /admin/orders
router.get("/admin/orders", async (req, res): Promise<void> => {
  const params = AdminListOrdersQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const whereClause = status ? eq(ordersTable.status, status) : undefined;

  const [ordersResult, totalResult] = await Promise.all([
    db
      .select()
      .from(ordersTable)
      .where(whereClause)
      .orderBy(sql`${ordersTable.createdAt} DESC`)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(ordersTable).where(whereClause),
  ]);

  const orders = ordersResult.map((o) => ({
    ...o,
    amountUsd: Number(o.amountUsd),
    amountKhr: Number(o.amountKhr),
  }));

  res.json(
    AdminListOrdersResponse.parse({
      orders,
      total: totalResult[0].count,
      page,
      limit,
    })
  );
});

// GET /admin/orders/:id
router.get("/admin/orders/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminGetOrderParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, params.data.id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(
    AdminGetOrderResponse.parse({
      ...order,
      amountUsd: Number(order.amountUsd),
      amountKhr: Number(order.amountKhr),
    })
  );
});

// PATCH /admin/orders/:id
router.patch("/admin/orders/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminUpdateOrderParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = AdminUpdateOrderBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.status != null) updates.status = body.data.status;
  if (body.data.notes != null) updates.notes = body.data.notes;
  if (body.data.paymentRef != null) updates.paymentRef = body.data.paymentRef;

  const [order] = await db
    .update(ordersTable)
    .set(updates)
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(
    AdminUpdateOrderResponse.parse({
      ...order,
      amountUsd: Number(order.amountUsd),
      amountKhr: Number(order.amountKhr),
    })
  );
});

// GET /admin/bookings
router.get("/admin/bookings", async (req, res): Promise<void> => {
  const params = AdminListBookingsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { status, page = 1, limit = 20 } = params.data;
  const offset = (page - 1) * limit;

  const whereClause = status ? eq(bookingsTable.status, status) : undefined;

  const [bookingsResult, totalResult] = await Promise.all([
    db
      .select()
      .from(bookingsTable)
      .where(whereClause)
      .orderBy(sql`${bookingsTable.createdAt} DESC`)
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(bookingsTable).where(whereClause),
  ]);

  const bookings = bookingsResult.map((b) => ({
    ...b,
    amountUsd: Number(b.amountUsd),
    amountKhr: Number(b.amountKhr),
  }));

  res.json(
    AdminListBookingsResponse.parse({
      bookings,
      total: totalResult[0].count,
      page,
      limit,
    })
  );
});

// GET /admin/bookings/:id
router.get("/admin/bookings/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminGetBookingParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .select()
    .from(bookingsTable)
    .where(eq(bookingsTable.id, params.data.id));

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(
    AdminGetBookingResponse.parse({
      ...booking,
      amountUsd: Number(booking.amountUsd),
      amountKhr: Number(booking.amountKhr),
    })
  );
});

// PATCH /admin/bookings/:id
router.patch("/admin/bookings/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = AdminUpdateBookingParams.safeParse({ id: rawId });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = AdminUpdateBookingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updates: Record<string, unknown> = {};
  if (body.data.status != null) updates.status = body.data.status;
  if (body.data.zoomLink != null) updates.zoomLink = body.data.zoomLink;
  if (body.data.notes != null) updates.notes = body.data.notes;
  if (body.data.paymentRef != null) updates.paymentRef = body.data.paymentRef;

  const [booking] = await db
    .update(bookingsTable)
    .set(updates)
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(
    AdminUpdateBookingResponse.parse({
      ...booking,
      amountUsd: Number(booking.amountUsd),
      amountKhr: Number(booking.amountKhr),
    })
  );
});

// GET /admin/stats
router.get("/admin/stats", async (req, res): Promise<void> => {
  const [orderStats, bookingStats, recentOrders, recentBookings] =
    await Promise.all([
      db
        .select({
          status: ordersTable.status,
          cnt: count(),
          totalUsd: sql<string>`sum(${ordersTable.amountUsd}::numeric)`,
        })
        .from(ordersTable)
        .groupBy(ordersTable.status),
      db
        .select({
          status: bookingsTable.status,
          cnt: count(),
          totalUsd: sql<string>`sum(${bookingsTable.amountUsd}::numeric)`,
        })
        .from(bookingsTable)
        .groupBy(bookingsTable.status),
      db
        .select()
        .from(ordersTable)
        .orderBy(sql`${ordersTable.createdAt} DESC`)
        .limit(5),
      db
        .select()
        .from(bookingsTable)
        .orderBy(sql`${bookingsTable.createdAt} DESC`)
        .limit(5),
    ]);

  const totalOrders = orderStats.reduce((sum, r) => sum + r.cnt, 0);
  const totalBookings = bookingStats.reduce((sum, r) => sum + r.cnt, 0);
  const pendingOrders = orderStats.find((r) => r.status === "pending")?.cnt ?? 0;
  const pendingBookings = bookingStats.find((r) => r.status === "pending")?.cnt ?? 0;
  const inProgressOrders = orderStats.find((r) => r.status === "in_progress")?.cnt ?? 0;
  const paidOrdersTotal = Number(
    orderStats.find((r) => r.status === "paid")?.totalUsd ?? 0
  );
  const paidBookingsTotal = Number(
    bookingStats.find((r) => r.status === "paid")?.totalUsd ?? 0
  );

  res.json(
    AdminGetStatsResponse.parse({
      totalOrders,
      totalBookings,
      pendingOrders,
      pendingBookings,
      inProgressOrders,
      paidOrdersTotal,
      paidBookingsTotal,
      recentOrders: recentOrders.map((o) => ({
        ...o,
        amountUsd: Number(o.amountUsd),
        amountKhr: Number(o.amountKhr),
      })),
      recentBookings: recentBookings.map((b) => ({
        ...b,
        amountUsd: Number(b.amountUsd),
        amountKhr: Number(b.amountKhr),
      })),
    })
  );
});

export default router;
