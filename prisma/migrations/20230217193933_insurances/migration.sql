/*
  Warnings:

  - You are about to drop the column `insurance_id` on the `cases` table. All the data in the column will be lost.
  - Added the required column `caseId` to the `insurances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_insurance_id_fkey";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "insurance_id";

-- AlterTable
ALTER TABLE "insurances" ADD COLUMN     "caseId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
