/*
  Warnings:

  - A unique constraint covering the columns `[product_tab_id]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `product_tab_id` to the `cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "product_tab_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "productTab" (
    "product_tab_id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "catalogNumber" TEXT DEFAULT '',
    "vendorConfirmation" BOOLEAN,
    "implantDelivery" BOOLEAN,
    "trayDelivery" BOOLEAN,
    "sterilization" BOOLEAN,
    "caseId" INTEGER,
    "manufacturerId" INTEGER,
    "vendorId" INTEGER,

    CONSTRAINT "productTab_pkey" PRIMARY KEY ("product_tab_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL DEFAULT '',
    "productType" TEXT DEFAULT '',

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "manufacturer" (
    "manufacturer_id" SERIAL NOT NULL,
    "manufacturer_name" TEXT NOT NULL,

    CONSTRAINT "manufacturer_pkey" PRIMARY KEY ("manufacturer_id")
);

-- CreateTable
CREATE TABLE "vendor" (
    "vendor_id" SERIAL NOT NULL,
    "vendor_name" TEXT NOT NULL,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("vendor_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_product_tab_id_key" ON "cases"("product_tab_id");

-- AddForeignKey
ALTER TABLE "productTab" ADD CONSTRAINT "productTab_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "manufacturer"("manufacturer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productTab" ADD CONSTRAINT "productTab_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendor"("vendor_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productTab" ADD CONSTRAINT "productTab_product_tab_id_fkey" FOREIGN KEY ("product_tab_id") REFERENCES "cases"("product_tab_id") ON DELETE RESTRICT ON UPDATE CASCADE;
