/*
  Warnings:

  - You are about to drop the column `itemId` on the `Claim` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lostItemId,foundItemId]` on the table `Match` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `Notification` required. This step will fail if there are existing NULL values in that column.
  - Made the column `message` on table `Notification` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MATCH_FOUND', 'CLAIM_APPROVED', 'CLAIM_REJECTED');

-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_itemId_fkey";

-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "itemId",
ADD COLUMN     "similarityAtClaim" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Item" DROP COLUMN "timestamp",
ADD COLUMN     "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "notificationSent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "type" "NotificationType" NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "message" SET NOT NULL;

-- CreateTable
CREATE TABLE "ClaimAnswer" (
    "id" SERIAL NOT NULL,
    "claimId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClaimAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Claim_claimerId_idx" ON "Claim"("claimerId");

-- CreateIndex
CREATE INDEX "Match_lostItemId_idx" ON "Match"("lostItemId");

-- CreateIndex
CREATE INDEX "Match_foundItemId_idx" ON "Match"("foundItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Match_lostItemId_foundItemId_key" ON "Match"("lostItemId", "foundItemId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- AddForeignKey
ALTER TABLE "ClaimAnswer" ADD CONSTRAINT "ClaimAnswer_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
