/*
  Warnings:

  - You are about to drop the column `location_name` on the `providers` table. All the data in the column will be lost.
  - You are about to drop the column `service_line` on the `providers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "providers" DROP COLUMN "location_name",
DROP COLUMN "service_line";
