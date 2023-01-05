/*
  Warnings:

  - You are about to drop the column `procedure_units` on the `locations` table. All the data in the column will be lost.
  - You are about to drop the column `location_name` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `service_line` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the `provider_locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "locations" DROP COLUMN "procedure_units",
ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "location_name",
DROP COLUMN "service_line",
ALTER COLUMN "create_time" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "update_time" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "provider_locations";

-- CreateTable
CREATE TABLE "procedureUnits" (
    "procedure_unit_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "procedure_unit_name" TEXT,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "procedureUnits_pkey" PRIMARY KEY ("procedure_unit_id")
);

-- CreateTable
CREATE TABLE "serviceLines" (
    "service_line_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "service_line_name" TEXT,
    "procedureUnitId" INTEGER NOT NULL,

    CONSTRAINT "serviceLines_pkey" PRIMARY KEY ("service_line_id")
);

-- CreateTable
CREATE TABLE "ServiceLineToProvider" (
    "serviceLineId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "ServiceLineToProvider_pkey" PRIMARY KEY ("serviceLineId","providerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "procedureUnits_fhir_resource_id_key" ON "procedureUnits"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "serviceLines_fhir_resource_id_key" ON "serviceLines"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "procedureUnits" ADD CONSTRAINT "procedureUnits_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceLines" ADD CONSTRAINT "serviceLines_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedureUnits"("procedure_unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLines"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;
