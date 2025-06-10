/*
  Warnings:

  - Added the required column `signature` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `amount` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "signature" TEXT NOT NULL,
DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL;
