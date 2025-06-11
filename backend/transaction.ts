import { PrismaClient } from "@prisma/client";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import express from "express"

export const transaction = express.Router();
const prisma = new PrismaClient()


transaction.get("/airdrop", async (req, res) => {

    const connection = new Connection(clusterApiUrl("devnet"));
    if (!connection) {
        res.send("Failed to connect devnets ");
    }
    try {
        const pubkey = await prisma.keys.findFirst({
            where: {
                userId: 1,
                id:1
            }
        })
        const publicKey = new PublicKey(pubkey?.publicKeys as string)
        const drop = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL * 1)
        const tx = await connection.confirmTransaction(drop)
        res.send(tx.value)
    }
    catch (e) {
        res.send("Error");
    }


})