import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { JWT_SECRTE } from "./secrete";

export interface AuthRequest extends Request {
    userId?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.auth;
        if (!token) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRTE) as JwtPayload;
        req.userId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Invalid token" });
    }
};
