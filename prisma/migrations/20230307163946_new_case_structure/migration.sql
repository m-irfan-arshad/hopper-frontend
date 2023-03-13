/*
  Warnings:

  - You are about to drop the column `admission_type` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `location_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `procedure_date` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `procedure_unit_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `provider_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `service_line_id` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.

*/
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
ALTER TABLE "patients" DROP CONSTRAINT "patients_sexId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_stateId_fkey";

-- AlterTable
ALTER TABLE "cases" DROP COLUMN "admission_type",
DROP COLUMN "location_id",
DROP COLUMN "procedure_date",
DROP COLUMN "procedure_unit_id",
DROP COLUMN "provider_id",
DROP COLUMN "service_line_id",
ADD COLUMN     "scheduling_id" INTEGER;

-- DropTable
DROP TABLE "patients";

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

-- CreateIndex
CREATE UNIQUE INDEX "patient_fhir_resource_id_key" ON "patient"("fhir_resource_id");

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
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_procedure_unit_id_fkey" FOREIGN KEY ("procedure_unit_id") REFERENCES "procedureUnits"("procedure_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_service_line_id_fkey" FOREIGN KEY ("service_line_id") REFERENCES "serviceLines"("service_line_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "providers"("provider_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
