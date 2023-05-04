/*
  Warnings:

  - You are about to drop the column `address` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `state_id` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `zip` on the `patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_state_id_fkey";

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "address",
DROP COLUMN "city",
DROP COLUMN "state_id",
DROP COLUMN "zip";

-- CreateTable
CREATE TABLE "address" (
    "address_id" SERIAL NOT NULL,
    "patient_id" INTEGER,
    "state_id" INTEGER,
    "address_one" TEXT DEFAULT '',
    "address_two" TEXT DEFAULT '',
    "city" TEXT DEFAULT '',
    "zip" TEXT DEFAULT '',

    CONSTRAINT "address_pkey" PRIMARY KEY ("address_id")
);

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
