# Solana Payment System

A backend application for managing Solana cryptocurrency transactions with a PostgreSQL database using Prisma ORM.

## Features

- Generate Solana keypairs and store them in a database
- Request airdrops from a local Solana validator
- Check wallet balances
- Transfer SOL between wallets
- Record transaction history in a database

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Bun
- **Blockchain**: Solana Web3.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Environment**: dotenv for configuration

## Prerequisites

- Bun installed
- PostgreSQL database
- Local Solana validator (or connection to testnet/devnet)

## Setup

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### 3. Setup the database

Run Prisma migrations to create necessary tables:

```bash
bunx prisma migrate dev
```

### 4. Start a local Solana validator (if using local development)

```bash
solana-test-validator
```

## Usage

### Generate a new Solana keypair

```bash
bun run prisma/keypair.ts
```

This will:
- Generate a new Solana keypair
- Store the public and private keys in the database

### Request an airdrop

To get test SOL on your account (for local development):

```bash
bun run prisma/keypair.ts
```

Uncomment the line `await drops();` first.

### Transfer SOL

Transfer SOL from one account to another:

```bash
bun run prisma/payments.ts
```

This will:
1. Fetch the keypair from the database
2. Create a transaction to send SOL to the recipient
3. Record the transaction in the payment history

### View payment history

```bash
bun run prisma/payments.ts
```

## Database Schema

The application uses the following database tables:

### Keys Table
- `id`: Unique identifier
- `publicKeys`: Public key in base58 format
- `privateKeys`: Private key stored as a string
- `userId`: User identifier

### Payment Table
- `id`: Unique identifier
- `fromKey`: Sender's public key
- `toKey`: Recipient's public key
- `amount`: Amount of SOL transferred
- `signature`: Transaction signature
- `userId`: User identifier
- `timestamp`: Time of transaction

## Development

### Migrations

After making changes to the `schema.prisma` file, run:

```bash
bunx prisma migrate dev --name <migration-name>
```

### Seed Database

If you need to seed the database with initial data:

```bash
bunx prisma db seed
```

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
