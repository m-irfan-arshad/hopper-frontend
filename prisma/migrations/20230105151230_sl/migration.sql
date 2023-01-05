/*
  Warnings:

  - You are about to drop the column `serviceLineId` on the `providers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "providers" DROP CONSTRAINT "providers_serviceLineId_fkey";

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "serviceLineId";
