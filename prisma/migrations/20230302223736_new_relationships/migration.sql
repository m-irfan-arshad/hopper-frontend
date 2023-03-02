/*
  Warnings:

  - You are about to drop the column `sex` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the `insurances` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "insurances" DROP CONSTRAINT "insurances_case_id_fkey";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "sex",
DROP COLUMN "state",
ADD COLUMN     "sexId" INTEGER,
ADD COLUMN     "stateId" INTEGER;

-- DropTable
DROP TABLE "insurances";

-- CreateTable
CREATE TABLE "sex" (
    "sex_id" SERIAL NOT NULL,
    "sexName" TEXT NOT NULL,

    CONSTRAINT "sex_pkey" PRIMARY KEY ("sex_id")
);

-- CreateTable
CREATE TABLE "state" (
    "state_id" SERIAL NOT NULL,
    "stateName" TEXT NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("state_id")
);

-- CreateTable
CREATE TABLE "financial" (
    "financial_id" SERIAL NOT NULL,
    "insurance_id" INTEGER,
    "insurance_group_name" TEXT,
    "insurance_group_number" TEXT,
    "prior_auth_approved_id" INTEGER,
    "prior_auth_id" TEXT,
    "prior_auth_date" TIMESTAMP(6),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "case_id" INTEGER,

    CONSTRAINT "financial_pkey" PRIMARY KEY ("financial_id")
);

-- CreateTable
CREATE TABLE "insurance" (
    "insurance_id" SERIAL NOT NULL,
    "insurance_name" TEXT NOT NULL,

    CONSTRAINT "insurance_pkey" PRIMARY KEY ("insurance_id")
);

-- CreateTable
CREATE TABLE "priorAuthApproved" (
    "prior_auth_approved_id" SERIAL NOT NULL,
    "prior_auth_approved_name" TEXT NOT NULL,

    CONSTRAINT "priorAuthApproved_pkey" PRIMARY KEY ("prior_auth_approved_id")
);

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_sexId_fkey" FOREIGN KEY ("sexId") REFERENCES "sex"("sex_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "insurance"("insurance_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_prior_auth_approved_id_fkey" FOREIGN KEY ("prior_auth_approved_id") REFERENCES "priorAuthApproved"("prior_auth_approved_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
