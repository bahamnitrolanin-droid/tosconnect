import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ordersRouter from "./orders";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";
import storageRouter from "./storage";
import paywayRouter from "./payway";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ordersRouter);
router.use(bookingsRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(paywayRouter);

export default router;
