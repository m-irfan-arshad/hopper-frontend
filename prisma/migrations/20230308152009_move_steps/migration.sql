/*
  Warnings:

  - You are about to drop the column `prior_authorization` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_confirmation` on the `cases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "cases" DROP COLUMN "prior_authorization",
DROP COLUMN "vendor_confirmation";

-- AlterTable
ALTER TABLE "scheduling" ADD COLUMN     "prior_authorization" TEXT NOT NULL DEFAULT 'Incomplete',
ADD COLUMN     "vendor_confirmation" TEXT NOT NULL DEFAULT 'Incomplete';
