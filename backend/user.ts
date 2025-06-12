import { PrismaClient } from "@prisma/client";
import express from "express"

import jwt, { type JwtPayload } from "jsonwebtoken";
import { JWT_SECRTE } from "./secrete";
import crypto from "crypto";
import cookie from "cookie-parser";
const route = express.Router();
const prisma = new PrismaClient()


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
        res.send("error")
        console.log(e);
    }
})

route.post("/login", async (req, res) => {
    try {

        
        const decode = req.cookies("auth");
        if (!decode) {
            return res.status(401).send("invaild Token")
        }
        const users = await prisma.user.findFirst({
            where: {
                id: decode.id
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



export default route;
