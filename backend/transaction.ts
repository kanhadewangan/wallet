import { PrismaClient } from "@prisma/client";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import express from "express"
import dotenv from "dotenv";
import { JWT_SECRTE, SOLANA_VALIDATOR } from "./secrete";
export const transaction = express.Router();
import jwt from "jsonwebtoken"
import { withAccelerate } from "@prisma/extension-accelerate";
const prisma = new PrismaClient().$extends(withAccelerate())
dotenv.config();

transaction.post("/airdrop", async (req, res) => {
    const auth = req.headers["auth"];
    const decode = jwt.verify(auth,JWT_SECRTE)
    const { pubkeys } = req.body;
    const connection = new Connection(clusterApiUrl("devnet"));
    if (!connection) {
        res.send("Failed to connect devnets ");
    }
    try {
        const pubkey = await prisma.keys.findFirst({
            where: {
                userId: decode.id,
                publicKeys: pubkeys
            }
        })
        const publicKey = new PublicKey(pubkey?.publicKeys as string)
        const drop = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL * 1)
        const tx = await connection.confirmTransaction(drop)
        res.send(tx)
    }
    catch (e) {
        res.json({"Error":  {"jsonrpc":"2.0","error":{"code": 429, "message":"You've either reached your airdrop limit today or the airdrop faucet has run dry. Please visit https://faucet.solana.com for alternate sources of test SOL"}, "id": "6b2a6da2-8bd1-4739-b6d6-de79974793c0" } });
        console.log(e)
    }

})