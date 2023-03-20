/*
  Warnings:

  - You are about to drop the column `sexId` on the `patient` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[scheduling_id]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[procedure_tab_id]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `procedure_tab_id` to the `cases` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cases" DROP CONSTRAINT "cases_scheduling_id_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_sexId_fkey";

-- DropForeignKey
ALTER TABLE "patient" DROP CONSTRAINT "patient_stateId_fkey";

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "procedure_tab_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "patient" DROP COLUMN "sexId",
DROP COLUMN "stateId",
ADD COLUMN     "sex_id" INTEGER,
ADD COLUMN     "state_id" INTEGER;

-- CreateTable
CREATE TABLE "procedureTab" (
    "procedure_tab_id" SERIAL NOT NULL,
    "procedure_id" INTEGER,
    "approach_id" INTEGER,
    "laterality_id" INTEGER,
    "anesthesia_id" INTEGER,
    "cpt_code_id" INTEGER,
    "icd_code_id" INTEGER,
    "case_id" INTEGER,

    CONSTRAINT "procedureTab_pkey" PRIMARY KEY ("procedure_tab_id")
);

-- CreateTable
CREATE TABLE "procedure" (
    "procedure_id" SERIAL NOT NULL,
    "procedure_name" TEXT NOT NULL,

    CONSTRAINT "procedure_pkey" PRIMARY KEY ("procedure_id")
);

-- CreateTable
CREATE TABLE "approach" (
    "approach_id" SERIAL NOT NULL,
    "approach_name" TEXT NOT NULL,

    CONSTRAINT "approach_pkey" PRIMARY KEY ("approach_id")
);

-- CreateTable
CREATE TABLE "laterality" (
    "laterality_id" SERIAL NOT NULL,
    "laterality_name" TEXT NOT NULL,

    CONSTRAINT "laterality_pkey" PRIMARY KEY ("laterality_id")
);

-- CreateTable
CREATE TABLE "anesthesia" (
    "anesthesia_id" SERIAL NOT NULL,
    "anesthesia_name" TEXT NOT NULL,

    CONSTRAINT "anesthesia_pkey" PRIMARY KEY ("anesthesia_id")
);

-- CreateTable
CREATE TABLE "cptCode" (
    "cpt_code_id" SERIAL NOT NULL,
    "cpt_code_name" TEXT NOT NULL,

    CONSTRAINT "cptCode_pkey" PRIMARY KEY ("cpt_code_id")
);

-- CreateTable
CREATE TABLE "icdCode" (
    "icd_code_id" SERIAL NOT NULL,
    "icd_code_name" TEXT NOT NULL,

    CONSTRAINT "icdCode_pkey" PRIMARY KEY ("icd_code_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_scheduling_id_key" ON "cases"("scheduling_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_procedure_tab_id_key" ON "cases"("procedure_tab_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_scheduling_id_fkey" FOREIGN KEY ("scheduling_id") REFERENCES "scheduling"("scheduling_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_procedure_tab_id_fkey" FOREIGN KEY ("procedure_tab_id") REFERENCES "procedureTab"("procedure_tab_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_sex_id_fkey" FOREIGN KEY ("sex_id") REFERENCES "sex"("sex_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedure"("procedure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_approach_id_fkey" FOREIGN KEY ("approach_id") REFERENCES "approach"("approach_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_laterality_id_fkey" FOREIGN KEY ("laterality_id") REFERENCES "laterality"("laterality_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_anesthesia_id_fkey" FOREIGN KEY ("anesthesia_id") REFERENCES "anesthesia"("anesthesia_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_cpt_code_id_fkey" FOREIGN KEY ("cpt_code_id") REFERENCES "cptCode"("cpt_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_icd_code_id_fkey" FOREIGN KEY ("icd_code_id") REFERENCES "icdCode"("icd_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
