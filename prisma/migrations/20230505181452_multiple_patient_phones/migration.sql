/*
  Warnings:

  - You are about to drop the column `home_phone` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `mobile_phone` on the `patient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "patient" DROP COLUMN "home_phone",
DROP COLUMN "mobile_phone";

-- CreateTable
CREATE TABLE "phone" (
    "phone_id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "phone_number" TEXT DEFAULT '',
    "type" TEXT DEFAULT '',
    "has_voicemail" BOOLEAN,

    CONSTRAINT "phone_pkey" PRIMARY KEY ("phone_id")
);

-- AddForeignKey
ALTER TABLE "phone" ADD CONSTRAINT "phone_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
