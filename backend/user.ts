import { PrismaClient } from "@prisma/client";
import express from "express"
import jwt from "jsonwebtoken";
import { JWT_SECRTE } from "./secrete";
import cookieParser from "cookie-parser";
import  { z } from "zod";
const route = express.Router();
import { withAccelerate } from "@prisma/extension-accelerate";
const prisma = new PrismaClient().$extends(withAccelerate())

// Add this to extend the Request type
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

route.use(cookieParser());

const schema = z.object({
    username:z.string(),
    email:z.string().email(),
    password:z.string().min(6),

})
 const login = z.object({
    email:z.string().email(),
    password:z.string().min(6)
 })

 route.use((req,res,next)=>{
    try{
    const header = req.headers["auth"];
    if(!header){
        return res.send("Not authorize");
    }
    const token = jwt.verify(header,JWT_SECRTE);
    (req as any).userId= token.users.id
    next();}
    catch(e){
        console.log(e)
        res.send("Server Down");
    }
 })
route.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = schema.parse(req.body);
        
        const users = await prisma.user.create({
            data: {
                username: username,
                password: password,
                email: email,
            },
            select: {
                id: true,
                username:true,
                email:true
            }
        })
        const auth = jwt.sign({
            users,
        }, JWT_SECRTE)
        console.log(auth);
       res.send(auth)
        
    }
    catch (e) {
        res.send("error").status(404);
        console.log(e);
    }
})

route.post("/login", async (req, res) => {
    try {
        const {email,password} = login.parse(req.body);

        const users = await prisma.user.findFirst({
            where: {
                email:email
            },
        })
        if(!users){
            res.send("No user Found")
        }
        const token = jwt.sign(users,JWT_SECRTE)
        res.send({
            token
        })
    }
    catch (e) {
        console.log(e)
        res.send(`error :${e}`)
    }
})

// route.get("/profile",  async (req , res) => {
//     try {
//         if (!req.userId) {
//             return res.status(401).json({ error: "User not authenticated" });
//         }
//         const user = await prisma.user.findUnique({
//             where: Number(req.userId)
//             select: {
//                 username: true,
//                 email: true
//             }
//         });
//         res.json({ user });
//     } catch (error) {
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

export default route;
