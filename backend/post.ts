import { PrismaClient } from "@prisma/client";
import express from "express"
const post = express.Router();
const prisma = new PrismaClient()



post.get("/all", async(req,res)=>{
    const data = await prisma.post.findMany();
    res.send(data)
})

post.post("/add",async (req,res)=>{
    try{
        const {title,author} = req.body;
        const post = await prisma.post.create({
            data:{
                title:title,
                author:author,
                author_id:2
            }
        })
        res.send(post);
    }
    catch(e){
        res.send(`error:${e}`)
    }
})

//params
post.get("/add/:id",async(req,res)=>{
    const id = req.params['id'] ;
    const data  = await prisma.post.findFirst({
        where:{
            id:parseInt(id),

        }
    })
    res.send(data);
})









export default post;