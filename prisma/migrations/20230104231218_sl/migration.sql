/*
  Warnings:

  - Added the required column `serviceLineId` to the `providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "serviceLineId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "providers" ADD CONSTRAINT "providers_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLines"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;
