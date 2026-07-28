import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../lib/logger";

export function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized — missing token" });
    return;
  }

  const token = authHeader.slice(7);
  const secret = process.env.SESSION_SECRET;

  if (!secret) {
    logger.error("SESSION_SECRET not set — cannot verify admin token");
    res.status(500).json({ error: "Server configuration error" });
    return;
  }

  try {
    jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: "Unauthorized — invalid or expired token" });
  }
}
