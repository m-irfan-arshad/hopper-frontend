/*
  Warnings:

  - You are about to drop the column `caseId` on the `insurances` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceGroupName` on the `insurances` table. All the data in the column will be lost.
  - You are about to drop the column `insuranceGroupNumber` on the `insurances` table. All the data in the column will be lost.
  - You are about to drop the column `priorAuthApproved` on the `insurances` table. All the data in the column will be lost.
  - You are about to drop the column `priorAuthDate` on the `insurances` table. All the data in the column will be lost.
  - You are about to drop the column `priorAuthId` on the `insurances` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_caseId_fkey";

-- AlterTable
ALTER TABLE "insurances" DROP COLUMN "caseId",
DROP COLUMN "insuranceGroupName",
DROP COLUMN "insuranceGroupNumber",
DROP COLUMN "priorAuthApproved",
DROP COLUMN "priorAuthDate",
DROP COLUMN "priorAuthId",
ADD COLUMN     "case_id" INTEGER,
ADD COLUMN     "insurance_group_name" TEXT,
ADD COLUMN     "insurance_group_number" TEXT,
ADD COLUMN     "prior_auth_approved" TEXT,
ADD COLUMN     "prior_auth_date" DATE,
ADD COLUMN     "prior_auth_id" TEXT,
ALTER COLUMN "insurance" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
