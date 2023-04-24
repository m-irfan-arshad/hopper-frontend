/*
  Warnings:

  - You are about to drop the `_clearanceFormToclinical` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_clinicalTodiagnosticTestForm` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_clearanceFormToclinical" DROP CONSTRAINT "_clearanceFormToclinical_A_fkey";

-- DropForeignKey
ALTER TABLE "_clearanceFormToclinical" DROP CONSTRAINT "_clearanceFormToclinical_B_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTodiagnosticTestForm" DROP CONSTRAINT "_clinicalTodiagnosticTestForm_A_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTodiagnosticTestForm" DROP CONSTRAINT "_clinicalTodiagnosticTestForm_B_fkey";

-- AlterTable
ALTER TABLE "clearanceForm" ADD COLUMN     "clinical_id" INTEGER;

-- AlterTable
ALTER TABLE "diagnosticTestForm" ADD COLUMN     "clinical_id" INTEGER;

-- DropTable
DROP TABLE "_clearanceFormToclinical";

-- DropTable
DROP TABLE "_clinicalTodiagnosticTestForm";

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_clinical_id_fkey" FOREIGN KEY ("clinical_id") REFERENCES "clinical"("clinical_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_clinical_id_fkey" FOREIGN KEY ("clinical_id") REFERENCES "clinical"("clinical_id") ON DELETE SET NULL ON UPDATE CASCADE;
