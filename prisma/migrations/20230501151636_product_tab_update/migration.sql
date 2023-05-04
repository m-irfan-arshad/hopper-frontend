/*
  Warnings:

  - You are about to drop the column `product_tab_id` on the `cases` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "productTab" DROP CONSTRAINT "productTab_product_tab_id_fkey";

-- DropIndex
DROP INDEX "cases_product_tab_id_key";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "product_tab_id";

-- AddForeignKey
ALTER TABLE "productTab" ADD CONSTRAINT "productTab_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("case_id") ON DELETE SET NULL ON UPDATE CASCADE;
