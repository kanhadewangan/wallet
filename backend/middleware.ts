import express from "express";
import type { Request } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRTE } from "./secrete";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: Request, res: express.Response, next: express.NextFunction) {
  try {
    const header = req.headers["auth"];
    if (!header || typeof header !== "string") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(header, JWT_SECRTE) as { id: string };
    (req as any).userId = decode.id;
    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized", error: e });
  }
}