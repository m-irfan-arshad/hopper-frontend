/*
  Warnings:

  - You are about to drop the column `same_as_procedure_location` on the `clearanceForm` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_date_time` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `pre_op_facility_id` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `show_pre_op_location` on the `clinicalTab` table. All the data in the column will be lost.
  - You are about to drop the column `same_as_procedure_location` on the `diagnosticTestForm` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "clinicalTab" DROP CONSTRAINT "clinicalTab_pre_op_facility_id_fkey";

-- AlterTable
ALTER TABLE "clearanceForm" DROP COLUMN "same_as_procedure_location",
ADD COLUMN     "at_procedure_location" BOOLEAN DEFAULT false,
ADD COLUMN     "physician_first_name" TEXT DEFAULT '',
ADD COLUMN     "physician_last_name" TEXT DEFAULT '',
ADD COLUMN     "physician_phone" TEXT DEFAULT '',
ALTER COLUMN "clearance_name_other" SET DEFAULT '';

-- AlterTable
ALTER TABLE "clinicalTab" DROP COLUMN "pre_op_date_time",
DROP COLUMN "pre_op_facility_id",
DROP COLUMN "show_pre_op_location",
ADD COLUMN     "post_op_date_time" TIMESTAMP(6),
ADD COLUMN     "pre_op_form_id" INTEGER;

-- AlterTable
ALTER TABLE "diagnosticTestForm" DROP COLUMN "same_as_procedure_location",
ADD COLUMN     "at_procedure_location" BOOLEAN DEFAULT false,
ALTER COLUMN "test_name_other" SET DEFAULT '';

-- CreateTable
CREATE TABLE "preOpForm" (
    "pre_op_form_id" SERIAL NOT NULL,
    "clinical_tab_id" INTEGER,
    "pre_op_date_time" TIMESTAMP(6),
    "at_procedure_location" BOOLEAN DEFAULT false,
    "facility_id" INTEGER,

    CONSTRAINT "preOpForm_pkey" PRIMARY KEY ("pre_op_form_id")
);

-- AddForeignKey
ALTER TABLE "clinicalTab" ADD CONSTRAINT "clinicalTab_pre_op_form_id_fkey" FOREIGN KEY ("pre_op_form_id") REFERENCES "preOpForm"("pre_op_form_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preOpForm" ADD CONSTRAINT "preOpForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;
