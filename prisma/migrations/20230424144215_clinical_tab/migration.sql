/*
  Warnings:

  - You are about to drop the column `same_as_procedure_location` on the `clearanceForm` table. All the data in the column will be lost.
  - You are about to drop the column `same_as_procedure_location` on the `diagnosticTestForm` table. All the data in the column will be lost.
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
ALTER TABLE "clinicalTab" DROP CONSTRAINT "clinicalTab_pre_op_facility_id_fkey";

-- AlterTable
ALTER TABLE "clearanceForm" DROP COLUMN "same_as_procedure_location",
ADD COLUMN     "at_procedure_location" BOOLEAN,
ADD COLUMN     "clinical_id" INTEGER,
ADD COLUMN     "physician_first_name" TEXT DEFAULT '',
ADD COLUMN     "physician_last_name" TEXT DEFAULT '',
ADD COLUMN     "physician_phone" TEXT DEFAULT '',
ALTER COLUMN "clearance_name_other" SET DEFAULT '',
ALTER COLUMN "clearance_date_time" DROP NOT NULL;

-- AlterTable
ALTER TABLE "diagnosticTestForm" DROP COLUMN "same_as_procedure_location",
ADD COLUMN     "at_procedure_location" BOOLEAN,
ADD COLUMN     "clinical_id" INTEGER,
ALTER COLUMN "test_name_other" SET DEFAULT '',
ALTER COLUMN "test_date_time" DROP NOT NULL;

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
    "pre_op_required" TEXT,
    "diagnostic_tests_required" TEXT,
    "clearance_required" TEXT,
    "post_op_date_time" TIMESTAMP(6),
    "pre_op_form_id" INTEGER,

    CONSTRAINT "clinical_pkey" PRIMARY KEY ("clinical_id")
);

-- CreateTable
CREATE TABLE "preOpForm" (
    "pre_op_form_id" SERIAL NOT NULL,
    "clinical_id" INTEGER,
    "pre_op_date_time" TIMESTAMP(6),
    "at_procedure_location" BOOLEAN,
    "facility_id" INTEGER,

    CONSTRAINT "preOpForm_pkey" PRIMARY KEY ("pre_op_form_id")
);

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_clinical_tab_id_fkey" FOREIGN KEY ("clinical_tab_id") REFERENCES "clinical"("clinical_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical" ADD CONSTRAINT "clinical_pre_op_form_id_fkey" FOREIGN KEY ("pre_op_form_id") REFERENCES "preOpForm"("pre_op_form_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preOpForm" ADD CONSTRAINT "preOpForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_clinical_id_fkey" FOREIGN KEY ("clinical_id") REFERENCES "clinical"("clinical_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_clinical_id_fkey" FOREIGN KEY ("clinical_id") REFERENCES "clinical"("clinical_id") ON DELETE SET NULL ON UPDATE CASCADE;
