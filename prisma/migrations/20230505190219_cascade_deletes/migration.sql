-- DropForeignKey
ALTER TABLE "procedureUnit" DROP CONSTRAINT "procedureUnit_locationId_fkey";

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE CASCADE ON UPDATE CASCADE;
