/*
  Warnings:

  - You are about to drop the `admission_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clinical_tab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cpt_code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `diagnostic_test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `icd_code` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedure_tab` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedure_unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_line` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_line_to_provicer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" DROP CONSTRAINT "_anesthesiaToprocedureTab_B_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" DROP CONSTRAINT "_clinicalTabTodiagnosticTest_A_fkey";

-- DropForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" DROP CONSTRAINT "_clinicalTabTodiagnosticTest_B_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_procedure_tab_id_fkey";

-- DropForeignKey
ALTER TABLE "diagnostic_test" DROP CONSTRAINT "diagnostic_test_test_name_id_fkey";

-- DropForeignKey
ALTER TABLE "procedure_tab" DROP CONSTRAINT "procedure_tab_approach_id_fkey";

-- DropForeignKey
ALTER TABLE "procedure_tab" DROP CONSTRAINT "procedure_tab_cpt_code_id_fkey";

-- DropForeignKey
ALTER TABLE "procedure_tab" DROP CONSTRAINT "procedure_tab_icd_code_id_fkey";

-- DropForeignKey
ALTER TABLE "procedure_tab" DROP CONSTRAINT "procedure_tab_laterality_id_fkey";

-- DropForeignKey
ALTER TABLE "procedure_tab" DROP CONSTRAINT "procedure_tab_procedure_id_fkey";

-- DropForeignKey
ALTER TABLE "procedure_unit" DROP CONSTRAINT "procedure_unit_locationId_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_admission_type_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_procedure_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_service_line_id_fkey";

-- DropForeignKey
ALTER TABLE "service_line" DROP CONSTRAINT "service_line_procedureUnitId_fkey";

-- DropForeignKey
ALTER TABLE "service_line_to_provicer" DROP CONSTRAINT "service_line_to_provicer_providerId_fkey";

-- DropForeignKey
ALTER TABLE "service_line_to_provicer" DROP CONSTRAINT "service_line_to_provicer_serviceLineId_fkey";

-- DropTable
DROP TABLE "admission_type";

-- DropTable
DROP TABLE "clinical_tab";

-- DropTable
DROP TABLE "cpt_code";

-- DropTable
DROP TABLE "diagnostic_test";

-- DropTable
DROP TABLE "icd_code";

-- DropTable
DROP TABLE "procedure_tab";

-- DropTable
DROP TABLE "procedure_unit";

-- DropTable
DROP TABLE "service_line";

-- DropTable
DROP TABLE "service_line_to_provicer";

-- CreateTable
CREATE TABLE "admissionType" (
    "admission_type_id" SERIAL NOT NULL,
    "admissionTypeName" TEXT NOT NULL,

    CONSTRAINT "admissionType_pkey" PRIMARY KEY ("admission_type_id")
);

-- CreateTable
CREATE TABLE "procedureUnit" (
    "procedure_unit_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "procedure_unit_name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "procedureUnit_pkey" PRIMARY KEY ("procedure_unit_id")
);

-- CreateTable
CREATE TABLE "serviceLine" (
    "service_line_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "service_line_name" TEXT NOT NULL,
    "procedureUnitId" INTEGER NOT NULL,

    CONSTRAINT "serviceLine_pkey" PRIMARY KEY ("service_line_id")
);

-- CreateTable
CREATE TABLE "ServiceLineToProvider" (
    "serviceLineId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "ServiceLineToProvider_pkey" PRIMARY KEY ("serviceLineId","providerId")
);

-- CreateTable
CREATE TABLE "procedureTab" (
    "procedure_tab_id" SERIAL NOT NULL,
    "procedure_id" INTEGER,
    "approach_id" INTEGER,
    "laterality_id" INTEGER,
    "cpt_code_id" INTEGER,
    "icd_code_id" INTEGER,
    "case_id" INTEGER,
    "anesthesia_notes" TEXT DEFAULT '',

    CONSTRAINT "procedureTab_pkey" PRIMARY KEY ("procedure_tab_id")
);

-- CreateTable
CREATE TABLE "cptCode" (
    "cpt_code_id" SERIAL NOT NULL,
    "cpt_code_name" TEXT NOT NULL,

    CONSTRAINT "cptCode_pkey" PRIMARY KEY ("cpt_code_id")
);

-- CreateTable
CREATE TABLE "icdCode" (
    "icd_code_id" SERIAL NOT NULL,
    "icd_code_name" TEXT NOT NULL,

    CONSTRAINT "icdCode_pkey" PRIMARY KEY ("icd_code_id")
);

-- CreateTable
CREATE TABLE "clinicalTab" (
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

    CONSTRAINT "clinicalTab_pkey" PRIMARY KEY ("clinical_tab_id")
);

-- CreateTable
CREATE TABLE "diagnosticTest" (
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

    CONSTRAINT "diagnosticTest_pkey" PRIMARY KEY ("diagnostic_test_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "procedureUnit_fhir_resource_id_key" ON "procedureUnit"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "serviceLine_fhir_resource_id_key" ON "serviceLine"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_procedure_tab_id_fkey" FOREIGN KEY ("procedure_tab_id") REFERENCES "procedureTab"("procedure_tab_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_admission_type_id_fkey" FOREIGN KEY ("admission_type_id") REFERENCES "admissionType"("admission_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_procedure_unit_id_fkey" FOREIGN KEY ("procedure_unit_id") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_service_line_id_fkey" FOREIGN KEY ("service_line_id") REFERENCES "serviceLine"("service_line_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceLine" ADD CONSTRAINT "serviceLine_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLine"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedure"("procedure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_approach_id_fkey" FOREIGN KEY ("approach_id") REFERENCES "approach"("approach_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_laterality_id_fkey" FOREIGN KEY ("laterality_id") REFERENCES "laterality"("laterality_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_cpt_code_id_fkey" FOREIGN KEY ("cpt_code_id") REFERENCES "cptCode"("cpt_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_icd_code_id_fkey" FOREIGN KEY ("icd_code_id") REFERENCES "icdCode"("icd_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "diagnosticTest" ADD CONSTRAINT "diagnosticTest_test_name_id_fkey" FOREIGN KEY ("test_name_id") REFERENCES "diagnosticTestName"("diagnostic_test_name_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" ADD CONSTRAINT "_anesthesiaToprocedureTab_B_fkey" FOREIGN KEY ("B") REFERENCES "procedureTab"("procedure_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" ADD CONSTRAINT "_clinicalTabTodiagnosticTest_A_fkey" FOREIGN KEY ("A") REFERENCES "clinicalTab"("clinical_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_clinicalTabTodiagnosticTest" ADD CONSTRAINT "_clinicalTabTodiagnosticTest_B_fkey" FOREIGN KEY ("B") REFERENCES "diagnosticTest"("diagnostic_test_id") ON DELETE CASCADE ON UPDATE CASCADE;
