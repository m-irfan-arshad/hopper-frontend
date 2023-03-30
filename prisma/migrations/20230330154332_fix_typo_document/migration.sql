/*
  Warnings:

  - You are about to drop the column `signiture_date` on the `document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "document" DROP COLUMN "signiture_date",
ADD COLUMN     "signature_date" TIMESTAMP(3);
