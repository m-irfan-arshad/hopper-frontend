/*
  Warnings:

  - You are about to drop the column `address` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `home_phone` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_phone` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey";

-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_sex_id_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_state_id_fkey";

-- DropForeignKey
ALTER TABLE "procedureUnit" DROP CONSTRAINT "procedureUnit_locationId_fkey";

-- DropForeignKey
ALTER TABLE "serviceLine" DROP CONSTRAINT "serviceLine_procedureUnitId_fkey";

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "home_phone",
DROP COLUMN "mobile_phone",
DROP COLUMN "state_id",
DROP COLUMN "zip";

-- CreateTable
CREATE TABLE "phone" (
    "phone_id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "phone_number" TEXT DEFAULT '',
    "type" TEXT DEFAULT '',
    "has_voicemail" BOOLEAN,

    CONSTRAINT "phone_pkey" PRIMARY KEY ("phone_id")
);

-- CreateTable
CREATE TABLE "address" (
    "address_id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "state_id" INTEGER,
    "address_one" TEXT DEFAULT '',
    "address_two" TEXT DEFAULT '',
    "city" TEXT DEFAULT '',
    "zip" TEXT DEFAULT '',

    CONSTRAINT "address_pkey" PRIMARY KEY ("address_id")
);

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_sex_id_fkey" FOREIGN KEY ("sex_id") REFERENCES "sex"("sex_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "phone" ADD CONSTRAINT "phone_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("state_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceLine" ADD CONSTRAINT "serviceLine_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLine"("service_line_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("provider_id") ON DELETE CASCADE ON UPDATE CASCADE;
