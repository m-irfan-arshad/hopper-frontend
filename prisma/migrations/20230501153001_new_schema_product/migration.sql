-- AlterTable
ALTER TABLE "product" ADD COLUMN     "productTabId" INTEGER;

-- AlterTable
ALTER TABLE "productTab" ADD COLUMN     "productId" INTEGER;

-- AddForeignKey
ALTER TABLE "productTab" ADD CONSTRAINT "productTab_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
