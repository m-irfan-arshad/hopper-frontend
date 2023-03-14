/*
  Warnings:

  - You are about to drop the column `location_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `prior_authorization` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `procedure_date` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `procedure_unit_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `service_line_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the `insurances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `procedureUnits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `providers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serviceLines` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scheduling_id` to the `cases` table without a default value. This is not possible if the table is not empty.
  - Made the column `patient_id` on table `cases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_location_id_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_procedure_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_service_line_id_fkey";

-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_case_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureUnits" DROP CONSTRAINT "procedureUnits_locationId_fkey";

-- DropForeignKey
ALTER TABLE "serviceLines" DROP CONSTRAINT "serviceLines_procedureUnitId_fkey";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "location_id",
DROP COLUMN "prior_authorization",
DROP COLUMN "procedure_date",
DROP COLUMN "procedure_unit_id",
DROP COLUMN "provider_id",
DROP COLUMN "service_line_id",
ADD COLUMN     "scheduling_id" INTEGER NOT NULL,
ALTER COLUMN "patient_id" SET NOT NULL;

-- DropTable
DROP TABLE "insurances";

-- DropTable
DROP TABLE "locations";

-- DropTable
DROP TABLE "patients";

-- DropTable
DROP TABLE "procedureUnits";

-- DropTable
DROP TABLE "providers";

-- DropTable
DROP TABLE "serviceLines";

-- CreateTable
CREATE TABLE "patient" (
    "patient_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "first_name" TEXT,
    "middle_name" TEXT,
    "last_name" TEXT,
    "mrn" TEXT,
    "address" TEXT,
    "city" TEXT,
    "stateId" INTEGER,
    "zip" TEXT,
    "sexId" INTEGER,
    "mobile_phone" TEXT,
    "home_phone" TEXT,
    "date_of_birth" TIMESTAMP(6),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "sex" (
    "sex_id" SERIAL NOT NULL,
    "sexName" TEXT NOT NULL,

    CONSTRAINT "sex_pkey" PRIMARY KEY ("sex_id")
);

-- CreateTable
CREATE TABLE "state" (
    "state_id" SERIAL NOT NULL,
    "stateName" TEXT NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "scheduling" (
    "scheduling_id" SERIAL NOT NULL,
    "admission_type_id" INTEGER,
    "location_id" INTEGER,
    "procedure_unit_id" INTEGER,
    "service_line_id" INTEGER,
    "provider_id" INTEGER,
    "procedure_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "scheduling_pkey" PRIMARY KEY ("scheduling_id")
);

-- CreateTable
CREATE TABLE "admissionType" (
    "admission_type_id" SERIAL NOT NULL,
    "admissionTypeName" TEXT NOT NULL,

    CONSTRAINT "admissionType_pkey" PRIMARY KEY ("admission_type_id")
);

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

-- CreateTable
CREATE TABLE "financial" (
    "financial_id" SERIAL NOT NULL,
    "insurance_id" INTEGER,
    "insurance_group_name" TEXT,
    "insurance_group_number" TEXT,
    "prior_authorization" TEXT NOT NULL DEFAULT 'Incomplete',
    "prior_auth_id" TEXT,
    "prior_auth_date" TIMESTAMP(6),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "case_id" INTEGER,

    CONSTRAINT "financial_pkey" PRIMARY KEY ("financial_id")
);

-- CreateTable
CREATE TABLE "insurance" (
    "insurance_id" SERIAL NOT NULL,
    "insurance_name" TEXT NOT NULL,

    CONSTRAINT "insurance_pkey" PRIMARY KEY ("insurance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_fhir_resource_id_key" ON "patient"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_fhir_resource_id_key" ON "location"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "procedureUnit_fhir_resource_id_key" ON "procedureUnit"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "serviceLine_fhir_resource_id_key" ON "serviceLine"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_fhir_resource_id_key" ON "provider"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_scheduling_id_fkey" FOREIGN KEY ("scheduling_id") REFERENCES "scheduling"("scheduling_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_sexId_fkey" FOREIGN KEY ("sexId") REFERENCES "sex"("sex_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_admission_type_id_fkey" FOREIGN KEY ("admission_type_id") REFERENCES "admissionType"("admission_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "insurance"("insurance_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
