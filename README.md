# 💸 Solana Payment System

> Your go-to backend for managing Solana transactions, no cap fr fr 🚀

## ✨ What's the vibe?

This backend app is your ultimate wingman for handling Solana crypto transactions. It's like having a personal finance manager but for your digital assets. We're talking about:

- 🔑 Creating and storing Solana keypairs (keeping your crypto safe and sound)
- 🎁 Getting those sweet airdrops (free crypto, anyone?)
- 💰 Checking your wallet balance (gotta know what you're working with)
- 🔄 Transferring SOL between wallets (sharing is caring)
- 📝 Keeping track of all your transactions (no more "where did my SOL go?" moments)

## 🛠️ Tech Stack (the cool stuff we're using)

- **Language**: TypeScript (because we're fancy like that)
- **Runtime**: Bun (it's fast af)
- **Blockchain**: Solana Web3.js (the future is now)
- **Database**: PostgreSQL (storing your data like a boss)
- **ORM**: Prisma (making database stuff less painful)
- **Environment**: dotenv (keeping secrets, secret)

## 🎯 Before You Start

Make sure you've got:
- Bun installed (if not, what are you waiting for?)
- PostgreSQL database (your data's new home)
- Local Solana validator (or just connect to testnet/devnet)

## 🚀 Let's Get This Party Started

### 1. Install the good stuff

```bash
bun install
```

### 2. Set up your environment

Create a `.env` file in your project root:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name" 
```

### 3. Database setup (let's get organized)

```bash
bunx prisma migrate dev
```

### 4. Start your local Solana validator (if you're going local)

```bash
solana-test-validator
```

## 🎮 How to Use This Bad Boy

### Generate a new Solana keypair

```bash
bun run prisma/keypair.ts
```

This will:
- Create a fresh Solana keypair
- Store it safely in your database

### Get that airdrop (free money alert! 🚨)

```bash
bun run prisma/keypair.ts
```

Just uncomment `await drops();` and you're good to go!

### Send some SOL

```bash
bun run prisma/payments.ts
```

This will:
1. Grab your keypair from the database
2. Create a transaction to send SOL to your homie
3. Keep track of everything in the payment history

### Check your transaction history

```bash
bun run prisma/payments.ts
```

## 📊 Database Schema (the boring but important stuff)

### Keys Table
- `id`: Your unique identifier
- `publicKeys`: Public key (base58 format)
- `privateKeys`: Private key (keep this safe!)
- `userId`: Who you are

### Payment Table
- `id`: Transaction ID
- `fromKey`: Who sent it
- `toKey`: Who got it
- `amount`: How much SOL
- `signature`: Transaction signature
- `userId`: Who made it happen
- `timestamp`: When it went down

## 👨‍💻 Development Mode 

### Making Database Changes

After updating `schema.prisma`:

```bash
bunx prisma migrate dev --name <migration-name>
```

### Need some test data?

```bash
bunx prisma db seed
```

---

Made with ❤️ using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is literally the fastest JavaScript runtime out there, no cap.

> P.S. If you're reading this, you're probably a developer. Keep being awesome! 💪
