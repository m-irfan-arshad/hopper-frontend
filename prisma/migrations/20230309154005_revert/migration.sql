/*
  Warnings:

  - You are about to drop the `locationRow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "procedureUnit" DROP CONSTRAINT "procedureUnit_locationId_fkey";

-- DropForeignKey
ALTER TABLE "scheduling" DROP CONSTRAINT "scheduling_location_id_fkey";

-- DropTable
DROP TABLE "locationRow";

-- CreateTable
CREATE TABLE "location" (
    "location_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_pkey" PRIMARY KEY ("location_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_fhir_resource_id_key" ON "location"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;
