/*
  Warnings:

  - You are about to drop the column `vendor_confirmation` on the `financial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "vendor_confirmation" TEXT NOT NULL DEFAULT 'Incomplete';

-- AlterTable
ALTER TABLE "financial" DROP COLUMN "vendor_confirmation";
