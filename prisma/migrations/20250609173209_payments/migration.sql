/*
  Warnings:

  - Added the required column `fromKey` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toKey` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "fromKey" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "toKey" TEXT NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE TEXT;
