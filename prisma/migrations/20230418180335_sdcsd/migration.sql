/*
  Warnings:

  - You are about to drop the column `clinical_tab_id` on the `preOpForm` table. All the data in the column will be lost.
  - You are about to drop the `_clearanceFormToclinicalTab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_clinicalTabTodiagnosticTestForm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinicalTab` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_clearanceFormToclinicalTab" DROP CONSTRAINT "_clearanceFormToclinicalTab_A_fkey";

-- DropForeignKey
ALTER TABLE "_clearanceFormToclinicalTab" DROP CONSTRAINT "_clearanceFormToclinicalTab_B_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTestForm" DROP CONSTRAINT "_clinicalTabTodiagnosticTestForm_A_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTestForm" DROP CONSTRAINT "_clinicalTabTodiagnosticTestForm_B_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_clinical_tab_id_fkey";

-- DropForeignKey
ALTER TABLE "clinicalTab" DROP CONSTRAINT "clinicalTab_pre_op_form_id_fkey";

-- AlterTable
ALTER TABLE "preOpForm" DROP COLUMN "clinical_tab_id",
ADD COLUMN     "clinical_id" INTEGER;

-- DropTable
DROP TABLE "_clearanceFormToclinicalTab";

-- DropTable
DROP TABLE "_clinicalTabTodiagnosticTestForm";

-- DropTable
DROP TABLE "clinicalTab";

-- CreateTable
CREATE TABLE "clinical" (
    "clinical_id" SERIAL NOT NULL,
    "physician_first_name" TEXT DEFAULT '',
    "physician_last_name" TEXT DEFAULT '',
    "physician_phone" TEXT DEFAULT '',
    "pre_op_required" BOOLEAN DEFAULT false,
    "diagnostic_tests_required" BOOLEAN DEFAULT false,
    "clearance_required" BOOLEAN DEFAULT false,
    "post_op_date_time" TIMESTAMP(6),
    "pre_op_form_id" INTEGER,

    CONSTRAINT "clinical_pkey" PRIMARY KEY ("clinical_id")
);

-- CreateTable
CREATE TABLE "_clinicalTodiagnosticTestForm" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_clearanceFormToclinical" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_clinicalTodiagnosticTestForm_AB_unique" ON "_clinicalTodiagnosticTestForm"("A", "B");

-- CreateIndex
CREATE INDEX "_clinicalTodiagnosticTestForm_B_index" ON "_clinicalTodiagnosticTestForm"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_clearanceFormToclinical_AB_unique" ON "_clearanceFormToclinical"("A", "B");

-- CreateIndex
CREATE INDEX "_clearanceFormToclinical_B_index" ON "_clearanceFormToclinical"("B");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_clinical_tab_id_fkey" FOREIGN KEY ("clinical_tab_id") REFERENCES "clinical"("clinical_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical" ADD CONSTRAINT "clinical_pre_op_form_id_fkey" FOREIGN KEY ("pre_op_form_id") REFERENCES "preOpForm"("pre_op_form_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTodiagnosticTestForm" ADD CONSTRAINT "_clinicalTodiagnosticTestForm_A_fkey" FOREIGN KEY ("A") REFERENCES "clinical"("clinical_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTodiagnosticTestForm" ADD CONSTRAINT "_clinicalTodiagnosticTestForm_B_fkey" FOREIGN KEY ("B") REFERENCES "diagnosticTestForm"("diagnostic_test_form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clearanceFormToclinical" ADD CONSTRAINT "_clearanceFormToclinical_A_fkey" FOREIGN KEY ("A") REFERENCES "clearanceForm"("clearance_form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clearanceFormToclinical" ADD CONSTRAINT "_clearanceFormToclinical_B_fkey" FOREIGN KEY ("B") REFERENCES "clinical"("clinical_id") ON DELETE CASCADE ON UPDATE CASCADE;
