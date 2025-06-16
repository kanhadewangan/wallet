import { PrismaClient } from "@prisma/client";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import express, { Router } from "express"
import type { Request, Response } from "express"
import { auth, type AuthRequest } from "./middle";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { json } from "stream/consumers";
import { JWT_SECRTE } from "./secrete";
import { equal } from "assert";

const payment: Router = express.Router();
const prisma = new PrismaClient()

payment.use(async (req: AuthRequest, res: Response, next) => {
    if (req.path === "/") {
        return next();
    }

    try {
        const token = req.headers["auth"];
        if (!token || typeof token !== 'string') {
            return res.status(401).json({ message: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRTE) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

payment.get("/", async (req: AuthRequest, res: Response) => {
    const token = req.headers["auth"] as JwtPayload
    const decode = jwt.verify(token, JWT_SECRTE)
    const data = await prisma.payment.findMany({
        where: {
            userId: {
                equals: decode.id
            }
        }
    })
    res.send(data);
})

payment.post("/generate", async (req: AuthRequest, res: Response) => {

    const auth = req.headers["auth"];
    const token = jwt.verify(auth, JWT_SECRTE);
    console.log(token.users.id);
    const keypair = Keypair.generate();

    const data = await prisma.keys.create({
        data: {
            privateKeys: keypair.secretKey.toString(),
            publicKeys: keypair.publicKey.toBase58().toString(),
            userId: token.users.id
        },
        select: {
            publicKeys: true
        }
    })
    res.send(data);
})

interface BalanceRequest {
    publicKey: string;
}

payment.post("/balance", async (req, res) => {
    try {
        const headers = req.headers["auth"]
        if (!headers) {
            res.json({
                "message": "Not Authenticated",
                "status": 401
            })
        }
        const { publicKey } = req.body;

        // Enhanced validation
        if (!publicKey) {
            return res.status(400).json({ error: "Public key is required" });
        }

        if (typeof publicKey !== 'string') {
            return res.status(400).json({ error: "Public key must be a string" });
        }

        // Validate public key format (base58 encoded, should be 32-44 characters)
        if (publicKey.length < 32 || publicKey.length > 44) {
            return res.status(400).json({ error: "Invalid public key format" });
        }
        // Try to create PublicKey and catch any validation errors
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
    const auth = req.headers["auth"];
    if(!auth){
        res.json({
            "message":"Not authorize",
            "status":411
        })
    }
    const token = jwt.verify(auth,JWT_SECRTE);
        console.log(token)
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
                userId: 1,
                signature: signature
            }
        });

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

payment.get("/keys",async(req,res)=>{
    const token = req.headers["auth"]
    if(!token){
        res.json({
            "message":"Authorzation Failed",
        }).status(411)
    }
    const decode = jwt.verify(token,JWT_SECRTE);
    const keys = await prisma.keys.findMany({
        where:{
            userId:decode.users.id
        },
        select:{
            publicKeys:true
        }
    })

    res.send(keys);
})

payment.get("/history", async (req, res) => {
    try {
        const token = req.headers["auth"];
        if (!token || typeof token !== 'string') {
            console.log("No token provided");
            return res.status(401).json({ message: "Auth Required" });
        }

        const decode = jwt.verify(token, JWT_SECRTE) as { id: string };
        console.log(decode.users.id)
        const history = await prisma.payment.findFirst({
        where:{
            userId:decode.users.id,
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

        console.log( "History:", history);
        res.json(history);
    } catch (error) {
        console.error("Error in history endpoint:", error);
        res.status(500).json({ message: "Internal server error", error: error instanceof Error ? error.message : "Unknown error" });
    }
});


export default payment;