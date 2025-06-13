import { PrismaClient } from "@prisma/client";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import express from "express"
import dotenv from "dotenv";
import { SOLANA_VALIDATOR } from "./secrete";
export const transaction = express.Router();
const prisma = new PrismaClient()
dotenv.config();

transaction.post("/airdrop", async (req, res) => {
    const { pubkeys } = req.body;
    const connection = new Connection(SOLANA_VALIDATOR);
    if (!connection) {
        res.send("Failed to connect devnets ");
    }
    try {
        const pubkey = await prisma.keys.findFirst({
            where: {
                userId: 2,
                publicKeys: pubkeys
            }
        })
        const publicKey = new PublicKey(pubkey?.publicKeys as string)
        const drop = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL * 1)
        const tx = await connection.confirmTransaction(drop)
        const balance = await connection.getBalance(pubkeys);
        res.json({ "Transaction ": tx.value, "Balance": balance })
    }
    catch (e) {
        res.send("Error");
    }

})