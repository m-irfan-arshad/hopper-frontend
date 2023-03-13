/*
  Warnings:

  - Made the column `patient_id` on table `cases` required. This step will fail if there are existing NULL values in that column.
  - Made the column `scheduling_id` on table `cases` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "cases" ALTER COLUMN "patient_id" SET NOT NULL,
ALTER COLUMN "scheduling_id" SET NOT NULL;
