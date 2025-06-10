import { PrismaClient } from "@prisma/client";
import express from "express"



const route = express.Router();
const prisma = new PrismaClient()


route.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const users = await prisma.user.create({
            data: {
                username: username,
                password: password,
                email: email
            },
            select: {
                username: true,
                password: true
            }
        })
        res.json({
            "message": "login ",
            "data": users

        }).status(200)
    }
    catch (e) {
        res.send("error").status(404)
    }
})

route.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await prisma.user.findFirst({
            where: {
                username: username,
                password: password
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
