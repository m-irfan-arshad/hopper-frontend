/*
  Warnings:

  - You are about to drop the `ServiceLineToProvider` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `admissionType` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cptCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `icdCode` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedureTab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedureUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serviceLine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey";

-- DropForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" DROP CONSTRAINT "_anesthesiaToprocedureTab_B_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_procedure_tab_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureTab" DROP CONSTRAINT "procedureTab_approach_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureTab" DROP CONSTRAINT "procedureTab_cpt_code_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureTab" DROP CONSTRAINT "procedureTab_icd_code_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureTab" DROP CONSTRAINT "procedureTab_laterality_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureTab" DROP CONSTRAINT "procedureTab_procedure_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureUnit" DROP CONSTRAINT "procedureUnit_locationId_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_admission_type_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_procedure_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_service_line_id_fkey";

-- DropForeignKey
ALTER TABLE "serviceLine" DROP CONSTRAINT "serviceLine_procedureUnitId_fkey";

-- DropTable
DROP TABLE "ServiceLineToProvider";

-- DropTable
DROP TABLE "admissionType";

-- DropTable
DROP TABLE "cptCode";

-- DropTable
DROP TABLE "icdCode";

-- DropTable
DROP TABLE "procedureTab";

-- DropTable
DROP TABLE "procedureUnit";

-- DropTable
DROP TABLE "serviceLine";

-- CreateTable
CREATE TABLE "admission_type" (
    "admission_type_id" SERIAL NOT NULL,
    "admissionTypeName" TEXT NOT NULL,

    CONSTRAINT "admission_type_pkey" PRIMARY KEY ("admission_type_id")
);

-- CreateTable
CREATE TABLE "procedure_unit" (
    "procedure_unit_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "procedure_unit_name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "procedure_unit_pkey" PRIMARY KEY ("procedure_unit_id")
);

-- CreateTable
CREATE TABLE "service_line" (
    "service_line_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "service_line_name" TEXT NOT NULL,
    "procedureUnitId" INTEGER NOT NULL,

    CONSTRAINT "service_line_pkey" PRIMARY KEY ("service_line_id")
);

-- CreateTable
CREATE TABLE "service_line_to_provicer" (
    "serviceLineId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "service_line_to_provicer_pkey" PRIMARY KEY ("serviceLineId","providerId")
);

-- CreateTable
CREATE TABLE "procedure_tab" (
    "procedure_tab_id" SERIAL NOT NULL,
    "procedure_id" INTEGER,
    "approach_id" INTEGER,
    "laterality_id" INTEGER,
    "cpt_code_id" INTEGER,
    "icd_code_id" INTEGER,
    "case_id" INTEGER,
    "anesthesia_notes" TEXT DEFAULT '',

    CONSTRAINT "procedure_tab_pkey" PRIMARY KEY ("procedure_tab_id")
);

-- CreateTable
CREATE TABLE "cpt_code" (
    "cpt_code_id" SERIAL NOT NULL,
    "cpt_code_name" TEXT NOT NULL,

    CONSTRAINT "cpt_code_pkey" PRIMARY KEY ("cpt_code_id")
);

-- CreateTable
CREATE TABLE "icd_code" (
    "icd_code_id" SERIAL NOT NULL,
    "icd_code_name" TEXT NOT NULL,

    CONSTRAINT "icd_code_pkey" PRIMARY KEY ("icd_code_id")
);

-- CreateTable
CREATE TABLE "clinical_tab" (
    "clinical_tab_id" SERIAL NOT NULL,
    "physician_first_name" TEXT NOT NULL DEFAULT '',
    "physician_last_name" TEXT NOT NULL DEFAULT '',
    "physician_phone" TEXT NOT NULL DEFAULT '',
    "pre_op_required" BOOLEAN NOT NULL DEFAULT false,
    "pre_op_date_time" TIMESTAMP(6) NOT NULL,
    "show_pre_op_location" BOOLEAN NOT NULL DEFAULT false,
    "pre_op_facility_name" TEXT NOT NULL DEFAULT '',
    "pre_op_phone" TEXT NOT NULL DEFAULT '',
    "pre_op_address_one" TEXT NOT NULL DEFAULT '',
    "pre_op_address_two" TEXT NOT NULL DEFAULT '',
    "pre_op_city" TEXT NOT NULL DEFAULT '',
    "pre_op_state" TEXT NOT NULL DEFAULT '',
    "pre_op_zip" TEXT NOT NULL DEFAULT '',
    "diagnostic_tests_required" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "clinical_tab_pkey" PRIMARY KEY ("clinical_tab_id")
);

-- CreateTable
CREATE TABLE "diagnostic_test" (
    "diagnostic_test_id" SERIAL NOT NULL,
    "test_name_id" INTEGER,
    "test_date_time" TIMESTAMP(6) NOT NULL,
    "show_test_location" BOOLEAN NOT NULL DEFAULT false,
    "test_facility_name" TEXT NOT NULL DEFAULT '',
    "test_phone" TEXT NOT NULL DEFAULT '',
    "test_address_one" TEXT NOT NULL DEFAULT '',
    "test_address_two" TEXT NOT NULL DEFAULT '',
    "test_city" TEXT NOT NULL DEFAULT '',
    "test_state" TEXT NOT NULL DEFAULT '',
    "test_zip" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "diagnostic_test_pkey" PRIMARY KEY ("diagnostic_test_id")
);

-- CreateTable
CREATE TABLE "diagnosticTestName" (
    "diagnostic_test_name_id" SERIAL NOT NULL,
    "test_name" TEXT NOT NULL,

    CONSTRAINT "diagnosticTestName_pkey" PRIMARY KEY ("diagnostic_test_name_id")
);

-- CreateTable
CREATE TABLE "_clinicalTabTodiagnosticTest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "procedure_unit_fhir_resource_id_key" ON "procedure_unit"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_line_fhir_resource_id_key" ON "service_line"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "_clinicalTabTodiagnosticTest_AB_unique" ON "_clinicalTabTodiagnosticTest"("A", "B");

-- CreateIndex
CREATE INDEX "_clinicalTabTodiagnosticTest_B_index" ON "_clinicalTabTodiagnosticTest"("B");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_procedure_tab_id_fkey" FOREIGN KEY ("procedure_tab_id") REFERENCES "procedure_tab"("procedure_tab_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_admission_type_id_fkey" FOREIGN KEY ("admission_type_id") REFERENCES "admission_type"("admission_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_procedure_unit_id_fkey" FOREIGN KEY ("procedure_unit_id") REFERENCES "procedure_unit"("procedure_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_service_line_id_fkey" FOREIGN KEY ("service_line_id") REFERENCES "service_line"("service_line_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedure_unit" ADD CONSTRAINT "procedure_unit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_line" ADD CONSTRAINT "service_line_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedure_unit"("procedure_unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_line_to_provicer" ADD CONSTRAINT "service_line_to_provicer_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "service_line"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_line_to_provicer" ADD CONSTRAINT "service_line_to_provicer_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedure_tab" ADD CONSTRAINT "procedure_tab_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedure"("procedure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedure_tab" ADD CONSTRAINT "procedure_tab_approach_id_fkey" FOREIGN KEY ("approach_id") REFERENCES "approach"("approach_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedure_tab" ADD CONSTRAINT "procedure_tab_laterality_id_fkey" FOREIGN KEY ("laterality_id") REFERENCES "laterality"("laterality_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedure_tab" ADD CONSTRAINT "procedure_tab_cpt_code_id_fkey" FOREIGN KEY ("cpt_code_id") REFERENCES "cpt_code"("cpt_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedure_tab" ADD CONSTRAINT "procedure_tab_icd_code_id_fkey" FOREIGN KEY ("icd_code_id") REFERENCES "icd_code"("icd_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diagnostic_test" ADD CONSTRAINT "diagnostic_test_test_name_id_fkey" FOREIGN KEY ("test_name_id") REFERENCES "diagnosticTestName"("diagnostic_test_name_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" ADD CONSTRAINT "_anesthesiaToprocedureTab_B_fkey" FOREIGN KEY ("B") REFERENCES "procedure_tab"("procedure_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" ADD CONSTRAINT "_clinicalTabTodiagnosticTest_A_fkey" FOREIGN KEY ("A") REFERENCES "clinical_tab"("clinical_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" ADD CONSTRAINT "_clinicalTabTodiagnosticTest_B_fkey" FOREIGN KEY ("B") REFERENCES "diagnostic_test"("diagnostic_test_id") ON DELETE CASCADE ON UPDATE CASCADE;
