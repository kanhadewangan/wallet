import {  PrismaClient } from "@prisma/client";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey ,Transaction,SystemProgram } from "@solana/web3.js";

PublicKey.findProgramAddressSync
const keypair = Keypair.generate();
const secretKey = keypair.secretKey;
const publicKey = keypair.publicKey.toBase58();
const privateKey = keypair.secretKey.toString();
const prisma = new PrismaClient();


async function createKeypair() {
    try {
        const keys = await prisma.keys.create({
            data: {
                privateKeys: privateKey,
                publicKeys: publicKey,
                userId: 1 // Assuming you have a userId to associate with the keypair
            }
        })
        console.log("Keypair created:", keys);
    }
    catch (error) {
        console.error("Error creating keypair:", error);
    }
}

//  await createKeypair();

async function getKeypair() {
    try {
        const keys = await prisma.keys.findFirst({
            where: {
                userId: 1 // Assuming you want to fetch the keypair for a specific user
            },
            select: {
                publicKeys: true,
            }
        })
        console.log("Keypair fetched:", keys);
    }

    catch (error) {
        console.error("Error fetching keypair:", error);
    }
}
// await getKeypair();


async function drops() {
    // Connect to the Solana devnet
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const publicKey = await prisma.keys.findFirst({
        where: {
            userId: 1 // Assuming you want to fetch the keypair for a specific user
        },
        select: {
            publicKeys: true,
        }
    });
    const keys = new PublicKey(publicKey?.publicKeys as string);
    try {
        const airdrop = await connection.requestAirdrop(
            keys, // Public key of the account to receive the airdrop
            LAMPORTS_PER_SOL * 100 // Amount in lamports (1 SOL = 1,000,000,000 lamports)
        );
        await connection.confirmTransaction(airdrop);
        console.log("Airdrop requested:", airdrop);
        const balance = await connection.getBalance(keys);
        console.log(`Balance after airdrop: ${balance / LAMPORTS_PER_SOL} SOL`);
    }
    catch (error) {
        console.error("Error requesting airdrop:", error);
    }
}
//  await drops();
 async function getBalance() {
    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const publicKey = await prisma.keys.findFirst({
        where: {
            userId: 1 // Assuming you want to fetc h the keypair for a specific user
        },
        select: {
            publicKeys: true,
        }
    });
    const keys = new PublicKey(publicKey?.publicKeys as string);
    const balance = await connection.getBalance(keys);
    console.log(`Balance: ${balance / LAMPORTS_PER_SOL} SOL`);
    return balance;
}
// await getBalance();

 async function generatePair(){
    const keypair = Keypair.generate();
    const prisma = new PrismaClient();

    const keys =  await prisma.keys.create({
        data:{
            publicKeys: keypair.publicKey.toBase58(),
            privateKeys: keypair.secretKey.toString(),
            userId: 1 // Assuming you have a userId to associate with the keypair
        },
        select:{
            publicKeys: true,
        }

    })
    console.log("New Keypair generated:", keys);
}
//await generatePair();
async function getAllKeypairs() {
    try {
        const keypairs = await prisma.keys.findMany({
            select: {
                publicKeys: true,
                userId: true
            }
        });
        console.log("All Keypairs:", keypairs);
    }
    catch (error) {
        console.error("Error fetching all keypairs:", error);
    }
}

function pda(user: { publicKey: PublicKey }, programId: PublicKey) {
    let noteBump = PublicKey.findProgramAddressSync(
        [Buffer.from("note"), user.publicKey.toBuffer()],
        programId
    );
}

console.log("Public Key:", publicKey);
console.log("Private Key:", privateKey.toWellFormed());
console.log("Secret Key:", pda(keypair, new PublicKey("4Wn27sq2UsUvE1L6soxyGxwCy6zjqsN6GRq7RriNFDBc"))); // Replace with your actual program ID
