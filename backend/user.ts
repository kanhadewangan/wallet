import { PrismaClient } from "@prisma/client";
import express, { Router } from "express"
import type { Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRTE } from "./secrete";
import crypto from "crypto";
import cookieParser from "cookie-parser";
const route = express.Router();
import { auth, type AuthRequest } from "./middle";
const prisma = new PrismaClient()

route.use(cookieParser());

route.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const users = await prisma.user.create({
            data: {
                username: username,
                password: password,
                email: email,
            },
            select: {
                id: true
            }
        })
        const auth = jwt.sign({
            id: users.id,
        }, JWT_SECRTE)
        console.log(auth);
        res.cookie("auth",auth);
    }
    catch (e) {
        res.send("error").status(404);
        console.log(e);
    }
})

route.get("/login", async (req, res) => {
    try {
        let token = req.cookies("auth");
        if (!token) {
            return res.status(401).send("invaild Token")
        }
        const decode = jwt.verify(token, JWT_SECRTE) as JwtPayload;
        const users = await prisma.user.findFirst({
            where: {
                id: decode.id
            },
            select:{
                username:true
            }
        })
        res.send({
            users
        })
    }
    catch (e) {
        console.log(e)
        res.send(`error :${e}`)
    }
})

route.get("/profile", auth, async (req: AuthRequest, res: Response) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const user = await prisma.user.findUnique({
            where: { id: req.userId  },
            select: {
                username: true,
                email: true
            }
        });
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default route;
