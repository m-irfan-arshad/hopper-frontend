/*
  Warnings:

  - You are about to drop the column `sexId` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_sexId_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_stateId_fkey";

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "sexId",
DROP COLUMN "stateId",
ADD COLUMN     "sex_id" INTEGER,
ADD COLUMN     "state_id" INTEGER;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_sex_id_fkey" FOREIGN KEY ("sex_id") REFERENCES "sex"("sex_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
