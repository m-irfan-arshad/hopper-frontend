-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_providerId_fkey";

-- DropForeignKey
ALTER TABLE "ServiceLineToProvider" DROP CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey";

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLine"("service_line_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("provider_id") ON DELETE CASCADE ON UPDATE CASCADE;
