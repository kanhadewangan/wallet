import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import express, {type Router } from "express"
import jwt from "jsonwebtoken";
import { JWT_SECRTE } from "./secrete";
const prisma = new PrismaClient().$extends(withAccelerate())
const payment: Router = express.Router();


payment.use((req, res, next) => {
   
   try{ const header = req.headers["auth"];
    if (!header || typeof header !== "string") {
        return res.status(401).json({ message: "Authentication required" });
    }
    const token = jwt.verify(header, JWT_SECRTE);
    console.log();
    (req as any).userId = Number(token.users.id)
    console.log(req.userId)
    next();
}
catch(e){
    res.send("Server Down");
    console.log(e);
}
})

payment.get("/", async (req, res) => {

    const data = await prisma.payment.findFirst({
        where: {
            userId: Number(req.userId)

        }
    })
    res.send(data);
})

payment.get("/generate", async (req, res) => {
    const keypair = Keypair.generate();
    console.log(req.userId);
    const data = await prisma.keys.create({
        data: {
            privateKeys: keypair.secretKey.toString(),
            publicKeys: keypair.publicKey.toBase58().toString(),

            userId: Number(req.userId)
        },
        select: {
            publicKeys: true
        }
    })
    res.send(data);
})


payment.post("/balance", async (req, res) => {
    try {
        const { publicKey } = req.body;
        if (!publicKey) {
            return res.status(400).json({ error: "Public key is required" });
        }

        if (typeof publicKey !== 'string') {
            return res.status(400).json({ error: "Public key must be a string" });
        }

        if (publicKey.length < 32 || publicKey.length > 44) {
            return res.status(400).json({ error: "Invalid public key format" });
        }
        let keys;
        try {
            keys = new PublicKey(publicKey);
        } catch (keyError) {
            console.error("PublicKey creation error:", keyError);
            return res.status(400).json({ error: "Invalid public key format: " + (keyError as Error).message });
        }

        const connection = new Connection(clusterApiUrl("devnet"));
        const balance = await connection.getBalance(keys);

        res.json({
            publicKey: publicKey,
            balance: balance / LAMPORTS_PER_SOL,
            balanceInLamports: balance
        });
    } catch (error) {
        console.error("Error getting balance:", error);
        res.status(500).json({ error: "Failed to get balance: " + error });
    }
})

payment.post("/p2p", async (req, res) => {

    const { fromKey, toKey, amount } = req.body;

    if (!fromKey || !toKey || !amount) {
        return res.status(400).json({
            "message": "Invalid fields"
        });
    }

    try {
        const connection = new Connection(clusterApiUrl("devnet"));

        // Convert string public keys to PublicKey objects
        const fromPublicKey = new PublicKey(fromKey);
        const toPublicKey = new PublicKey(toKey);

        // Get the keypair from the database
        const keypairData = await prisma.keys.findFirst({
            where: {
                publicKeys: fromKey
            }
        });

        if (!keypairData) {
            return res.status(400).json({
                "message": "Sender keypair not found"
            });
        }

        // Convert the stored private key string back to Uint8Array
        const privateKeyArray = new Uint8Array(keypairData.privateKeys.split(',').map(Number));
        const keypair = Keypair.fromSecretKey(privateKeyArray);

        const tx = new Transaction();
        tx.add(SystemProgram.transfer({
            fromPubkey: fromPublicKey,
            toPubkey: toPublicKey,
            lamports: amount * LAMPORTS_PER_SOL
        }));

        const signature = await connection.sendTransaction(tx, [keypair]);
        await connection.confirmTransaction(signature);
        const data = await prisma.payment.create({
            data: {
                toKey: toKey,
                fromKey: fromKey,
                amount: amount,
                userId: Number(req.userId),
                signature: signature
            }
        });
        console.log(data);
        res.json({
            "message": "Transaction Successful",
            "check on": "solana explorer",
            "signature": signature
        });
    }
    catch (e) {
        console.error("Transaction error:", e);
        res.status(500).json({ error: `Error: ${e}` });
    }
})

payment.get("/keys", async (req, res) => {
    try {

        const keys = await prisma.keys.findMany({
            where: {
                userId: Number(req.userId)
            },
            select: {
                publicKeys: true
            }
        });

        res.json(keys);
    } catch (error) {
        console.error("Error fetching keys:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});

payment.get("/history", async (req, res) => {
    try {

        const history = await prisma.payment.findFirst({
            where: {
                userId: Number(req.userId)
            },
            select: {
                fromKey: true,
                toKey: true,
                amount: true,
                timestamp: true,
                signature: true
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        if (!history) {
            return res.json({ message: "No activity found" });
        }

        return res.json(history);
    } catch (error) {
        console.error("Error in history endpoint:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});
payment.get("/history/all", async (req, res) => {
    try {

        const history = await prisma.payment.findMany({
            where: {
                userId: Number(req.userId)
            },
            select: {
                fromKey: true,
                toKey: true,
                amount: true,
                timestamp: true,
                signature: true
            },
            orderBy: {
                timestamp: 'desc'
            }
        });

        if (!history) {
            return res.json({ message: "No activity found" });
        }

        return res.json(history);
    } catch (error) {
        console.error("Error in history endpoint:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
});


export default payment;