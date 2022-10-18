-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "prior_authorization" TEXT NOT NULL DEFAULT 'Incomplete',
ADD COLUMN     "vendor_confirmation" TEXT NOT NULL DEFAULT 'Incomplete';
