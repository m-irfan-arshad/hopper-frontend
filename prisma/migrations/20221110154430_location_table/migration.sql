-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "location_ids" INTEGER[];

-- CreateTable
CREATE TABLE "locations" (
    "location_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "location_name" TEXT,
    "create_time" TIMESTAMP(6),
    "update_time" TIMESTAMP(6),

    CONSTRAINT "locations_pkey" PRIMARY KEY ("location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locations_fhir_resource_id_key" ON "locations"("fhir_resource_id");
