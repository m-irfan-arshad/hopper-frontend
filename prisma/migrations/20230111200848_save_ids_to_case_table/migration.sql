/*
  Warnings:

  - You are about to drop the column `location_name` on the `cases` table. All the data in the column will be lost.
  - You are about to drop the column `provider_name` on the `cases` table. All the data in the column will be lost.
  - Made the column `fhir_resource_id` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location_name` on table `locations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fhir_resource_id` on table `procedureUnits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `procedure_unit_name` on table `procedureUnits` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fhir_resource_id` on table `providers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `first_name` on table `providers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `providers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fhir_resource_id` on table `serviceLines` required. This step will fail if there are existing NULL values in that column.
  - Made the column `service_line_name` on table `serviceLines` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cases" DROP COLUMN "location_name",
DROP COLUMN "provider_name",
ADD COLUMN     "location_id" INTEGER,
ADD COLUMN     "provider_id" INTEGER;

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "fhir_resource_id" SET NOT NULL,
ALTER COLUMN "location_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "procedureUnits" ALTER COLUMN "fhir_resource_id" SET NOT NULL,
ALTER COLUMN "procedure_unit_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "providers" ALTER COLUMN "fhir_resource_id" SET NOT NULL,
ALTER COLUMN "first_name" SET NOT NULL,
ALTER COLUMN "last_name" SET NOT NULL;

-- AlterTable
ALTER TABLE "serviceLines" ALTER COLUMN "fhir_resource_id" SET NOT NULL,
ALTER COLUMN "service_line_name" SET NOT NULL;
