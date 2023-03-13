/*
  Warnings:

  - You are about to drop the column `prior_auth_approved_id` on the `financial` table. All the data in the column will be lost.
  - You are about to drop the column `prior_auth_id` on the `financial` table. All the data in the column will be lost.
  - You are about to drop the column `prior_authorization` on the `scheduling` table. All the data in the column will be lost.
  - You are about to drop the column `vendor_confirmation` on the `scheduling` table. All the data in the column will be lost.
  - You are about to drop the `priorAuthApproved` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "financial" DROP CONSTRAINT "financial_prior_auth_approved_id_fkey";

-- AlterTable
ALTER TABLE "financial" DROP COLUMN "prior_auth_approved_id",
DROP COLUMN "prior_auth_id",
ADD COLUMN     "prior_authorization" TEXT NOT NULL DEFAULT 'Incomplete',
ADD COLUMN     "vendor_confirmation" TEXT NOT NULL DEFAULT 'Incomplete';

-- AlterTable
ALTER TABLE "scheduling" DROP COLUMN "prior_authorization",
DROP COLUMN "vendor_confirmation";

-- DropTable
DROP TABLE "priorAuthApproved";
