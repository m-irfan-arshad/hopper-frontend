/*
  Warnings:

  - You are about to drop the column `show_test_location` on the `diagnosticTest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "diagnosticTest" DROP COLUMN "show_test_location",
ADD COLUMN     "same_as_procedure_location" BOOLEAN NOT NULL DEFAULT false;
