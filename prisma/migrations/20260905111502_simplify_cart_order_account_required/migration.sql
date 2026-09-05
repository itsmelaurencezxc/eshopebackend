/*
  Warnings:

  - You are about to drop the column `sessionId` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `guestContact` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `guestEmail` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `order` table. All the data in the column will be lost.
  - Made the column `userId` on table `cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_userId_fkey";

-- DropIndex
DROP INDEX "cart_sessionId_key";

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "sessionId",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "guestContact",
DROP COLUMN "guestEmail",
DROP COLUMN "guestName",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
