/*
  Warnings:

  - You are about to drop the `location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "procedureUnit" DROP CONSTRAINT "procedureUnit_locationId_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_location_id_fkey";

-- DropTable
DROP TABLE "location";

-- CreateTable
CREATE TABLE "locationRow" (
    "location_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "locationRow_pkey" PRIMARY KEY ("location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "locationRow_fhir_resource_id_key" ON "locationRow"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locationRow"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locationRow"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
