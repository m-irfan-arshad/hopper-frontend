/*
  Warnings:

  - You are about to drop the column `location_ids` on the `providers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "locations" ADD COLUMN     "procedure_units" TEXT[];

-- AlterTable
ALTER TABLE "providers" DROP COLUMN "location_ids";

-- CreateTable
CREATE TABLE "provider_locations" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "create_time" TIMESTAMP(6),
    "update_time" TIMESTAMP(6),

    CONSTRAINT "provider_locations_pkey" PRIMARY KEY ("id")
);
