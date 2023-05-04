/*
  Warnings:

  - You are about to drop the column `productId` on the `productTab` table. All the data in the column will be lost.
  - You are about to drop the column `productTypeId` on the `productTab` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "productTab" DROP CONSTRAINT "productTab_productId_fkey";

-- DropForeignKey
ALTER TABLE "productTab" DROP CONSTRAINT "productTab_productTypeId_fkey";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "productName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "productTab" DROP COLUMN "productId",
DROP COLUMN "productTypeId",
ADD COLUMN     "productName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "productType" TEXT NOT NULL DEFAULT '';
