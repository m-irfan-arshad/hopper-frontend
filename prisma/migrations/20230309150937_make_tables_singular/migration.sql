/*
  Warnings:

  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedureUnits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `providers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serviceLines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey";

-- DropForeignKey
ALTER TABLE "procedureUnits" DROP CONSTRAINT "procedureUnits_locationId_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_location_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_procedure_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_service_line_id_fkey";

-- DropForeignKey
ALTER TABLE "serviceLines" DROP CONSTRAINT "serviceLines_procedureUnitId_fkey";

-- DropIndex
DROP INDEX "admissionType_admission_type_id_key";

-- DropIndex
DROP INDEX "cases_case_id_key";

-- DropIndex
DROP INDEX "financial_financial_id_key";

-- DropIndex
DROP INDEX "insurance_insurance_id_key";

-- DropIndex
DROP INDEX "patient_patient_id_key";

-- DropIndex
DROP INDEX "priorAuthApproved_prior_auth_approved_id_key";

-- DropIndex
DROP INDEX "scheduling_scheduling_id_key";

-- DropIndex
DROP INDEX "sex_sex_id_key";

-- DropIndex
DROP INDEX "state_state_id_key";

-- DropTable
DROP TABLE "locations";

-- DropTable
DROP TABLE "procedureUnits";

-- DropTable
DROP TABLE "providers";

-- DropTable
DROP TABLE "serviceLines";

-- CreateTable
CREATE TABLE "location" (
    "location_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_pkey" PRIMARY KEY ("location_id")
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
CREATE TABLE "provider" (
    "provider_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_fhir_resource_id_key" ON "location"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "procedureUnit_fhir_resource_id_key" ON "procedureUnit"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "serviceLine_fhir_resource_id_key" ON "serviceLine"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_fhir_resource_id_key" ON "provider"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_procedure_unit_id_fkey" FOREIGN KEY ("procedure_unit_id") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_service_line_id_fkey" FOREIGN KEY ("service_line_id") REFERENCES "serviceLine"("service_line_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceLine" ADD CONSTRAINT "serviceLine_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLine"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;
