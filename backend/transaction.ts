import { PrismaClient } from "@prisma/client";
import express from "express"

 export const transaction = express.Router();
const prisma = new PrismaClient()

//keys generation

transaction.get("/",(req,res)=>{
    
})