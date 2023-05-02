/*
  Warnings:

  - You are about to drop the column `productType` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "productType",
ADD COLUMN     "productTypeId" INTEGER;

-- AlterTable
ALTER TABLE "productTab" ADD COLUMN     "productTypeId" INTEGER;

-- CreateTable
CREATE TABLE "productType" (
    "product_type_id" SERIAL NOT NULL,
    "productType" TEXT NOT NULL,

    CONSTRAINT "productType_pkey" PRIMARY KEY ("product_type_id")
);

-- AddForeignKey
ALTER TABLE "productTab" ADD CONSTRAINT "productTab_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "productType"("product_type_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "productType"("product_type_id") ON DELETE SET NULL ON UPDATE CASCADE;
