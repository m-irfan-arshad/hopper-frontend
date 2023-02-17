/*
  Warnings:

  - The `prior_auth_date` column on the `insurances` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `date_of_birth` column on the `patients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "insurances" DROP COLUMN "prior_auth_date",
ADD COLUMN     "prior_auth_date" DATE;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "date_of_birth",
ADD COLUMN     "date_of_birth" DATE;
