/*
  Warnings:

  - You are about to drop the column `pre_op_address_one` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_address_two` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_city` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_facility_name` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_phone` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_state` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_zip` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `same_as_procedure_location` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_address_one` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_address_two` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_city` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_date_time` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_facility_name` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_name_id` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_name_other` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_phone` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_state` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the column `test_zip` on the `diagnosticTest` table. All the data in the column will be lost.
  - You are about to drop the `_clinicalTabTodiagnosticTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diagnosticTestName` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `test_name` to the `diagnosticTest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" DROP CONSTRAINT "_clinicalTabTodiagnosticTest_A_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" DROP CONSTRAINT "_clinicalTabTodiagnosticTest_B_fkey";

-- DropForeignKey
ALTER TABLE "diagnosticTest" DROP CONSTRAINT "diagnosticTest_test_name_id_fkey";

-- AlterTable
ALTER TABLE "clinicalTab" DROP COLUMN "pre_op_address_one",
DROP COLUMN "pre_op_address_two",
DROP COLUMN "pre_op_city",
DROP COLUMN "pre_op_facility_name",
DROP COLUMN "pre_op_phone",
DROP COLUMN "pre_op_state",
DROP COLUMN "pre_op_zip",
ADD COLUMN     "clearance_required" BOOLEAN DEFAULT false,
ADD COLUMN     "pre_op_facility_id" INTEGER;

-- AlterTable
ALTER TABLE "diagnosticTest" DROP COLUMN "same_as_procedure_location",
DROP COLUMN "test_address_one",
DROP COLUMN "test_address_two",
DROP COLUMN "test_city",
DROP COLUMN "test_date_time",
DROP COLUMN "test_facility_name",
DROP COLUMN "test_name_id",
DROP COLUMN "test_name_other",
DROP COLUMN "test_phone",
DROP COLUMN "test_state",
DROP COLUMN "test_zip",
ADD COLUMN     "test_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "_clinicalTabTodiagnosticTest";

-- DropTable
DROP TABLE "diagnosticTestName";

-- CreateTable
CREATE TABLE "facility" (
    "facility_id" SERIAL NOT NULL,
    "facility_name" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "address_one" TEXT NOT NULL DEFAULT '',
    "address_two" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "zip" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "facility_pkey" PRIMARY KEY ("facility_id")
);

-- CreateTable
CREATE TABLE "diagnosticTestForm" (
    "diagnostic_test_form_id" SERIAL NOT NULL,
    "diagnostic_test_id" INTEGER,
    "test_name_other" TEXT,
    "test_date_time" TIMESTAMP(6) NOT NULL,
    "same_as_procedure_location" BOOLEAN NOT NULL DEFAULT false,
    "facility_id" INTEGER,

    CONSTRAINT "diagnosticTestForm_pkey" PRIMARY KEY ("diagnostic_test_form_id")
);

-- CreateTable
CREATE TABLE "clearanceForm" (
    "clearance_form_id" SERIAL NOT NULL,
    "clearance_id" INTEGER,
    "clearance_name_other" TEXT,
    "clearance_date_time" TIMESTAMP(6) NOT NULL,
    "same_as_procedure_location" BOOLEAN NOT NULL DEFAULT false,
    "facility_id" INTEGER,

    CONSTRAINT "clearanceForm_pkey" PRIMARY KEY ("clearance_form_id")
);

-- CreateTable
CREATE TABLE "clearance" (
    "clearance_id" SERIAL NOT NULL,
    "clearance_name" TEXT NOT NULL,

    CONSTRAINT "clearance_pkey" PRIMARY KEY ("clearance_id")
);

-- CreateTable
CREATE TABLE "_clinicalTabTodiagnosticTestForm" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_clearanceFormToclinicalTab" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_clinicalTabTodiagnosticTestForm_AB_unique" ON "_clinicalTabTodiagnosticTestForm"("A", "B");

-- CreateIndex
CREATE INDEX "_clinicalTabTodiagnosticTestForm_B_index" ON "_clinicalTabTodiagnosticTestForm"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_clearanceFormToclinicalTab_AB_unique" ON "_clearanceFormToclinicalTab"("A", "B");

-- CreateIndex
CREATE INDEX "_clearanceFormToclinicalTab_B_index" ON "_clearanceFormToclinicalTab"("B");

-- AddForeignKey
ALTER TABLE "clinicalTab" ADD CONSTRAINT "clinicalTab_pre_op_facility_id_fkey" FOREIGN KEY ("pre_op_facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_diagnostic_test_id_fkey" FOREIGN KEY ("diagnostic_test_id") REFERENCES "diagnosticTest"("diagnostic_test_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_clearance_id_fkey" FOREIGN KEY ("clearance_id") REFERENCES "clearance"("clearance_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTestForm" ADD CONSTRAINT "_clinicalTabTodiagnosticTestForm_A_fkey" FOREIGN KEY ("A") REFERENCES "clinicalTab"("clinical_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTestForm" ADD CONSTRAINT "_clinicalTabTodiagnosticTestForm_B_fkey" FOREIGN KEY ("B") REFERENCES "diagnosticTestForm"("diagnostic_test_form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clearanceFormToclinicalTab" ADD CONSTRAINT "_clearanceFormToclinicalTab_A_fkey" FOREIGN KEY ("A") REFERENCES "clearanceForm"("clearance_form_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clearanceFormToclinicalTab" ADD CONSTRAINT "_clearanceFormToclinicalTab_B_fkey" FOREIGN KEY ("B") REFERENCES "clinicalTab"("clinical_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;
