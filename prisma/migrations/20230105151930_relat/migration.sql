/*
  Warnings:

  - Added the required column `serviceLineId` to the `providers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "providers" ADD COLUMN     "serviceLineId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ServiceLineToProvider" (
    "serviceLineId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "ServiceLineToProvider_pkey" PRIMARY KEY ("serviceLineId","providerId")
);

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLines"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;
