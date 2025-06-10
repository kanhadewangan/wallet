import { PrismaClient } from "@prisma/client";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file in the parent directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function transferSol() {
    const connection = new Connection("http://localhost:8899", "confirmed");
    const prisma = new PrismaClient();
    const keys = await prisma.keys.findFirst({
        where: {userId: 1}, // Assuming you want to fetch the keypair for a specific user
        select: {
            publicKeys: true,
            privateKeys: true
        }
    });
    
    if (!keys) {
        console.error("No keys found for the user");
        return;
    }
      const pubKeys = new PublicKey(keys.publicKeys);
    // Convert the comma-separated string to an array of numbers, then to Uint8Array
    const privateKeyData = keys.privateKeys.split(',').map(Number);
    const fromKeypair = Keypair.fromSecretKey(new Uint8Array(privateKeyData));
    const toPublicKey = new PublicKey("B6mKfyb4FaQ69z5mwqTDdxpvf24TGXGjKqUYAjhq9VE1"); // Replace with the recipient's public key
    const Amount = LAMPORTS_PER_SOL * 0.1; // Amount to transfer in lamports (0.1 SOL)
    // Ensure the amount is less than or equal to the balance of the sender's account
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toPublicKey,
            lamports: Amount,
        })
    );    try {
        const signature = await connection.sendTransaction(transaction, [fromKeypair]);
        console.log("Transaction sent with signature:", signature);
        await connection.confirmTransaction(signature);
        console.log("Transaction confirmed");
        const prisma = new PrismaClient();
        const transferRecord = await prisma.payment.create({
            data: {
                fromKey: fromKeypair.publicKey.toBase58(),
                toKey: toPublicKey.toBase58(),
                amount: Amount,
                signature: signature,
                userId: 1, // Assuming you have a userId to associate with the payment
            }
        });
        console.log("Payment record created:", transferRecord);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }
}

await transferSol();

async function getPayments() {
    const prisma = new PrismaClient();
    try {
        const payments = await prisma.payment.findMany({
            where: { userId: 1 }, // Assuming you want to fetch payments for a specific user
            select: {
                fromKey: true,
                toKey: true,
                amount: true,
                signature: true,
                timestamp: true,
            }
        });
        console.log("Payments fetched:", payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
    }
}
await getPayments();