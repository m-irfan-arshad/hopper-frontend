-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "insurance_id" INTEGER;

-- CreateTable
CREATE TABLE "insurances" (
    "insurance_id" SERIAL NOT NULL,
    "insurance" TEXT NOT NULL,
    "insuranceGroupName" TEXT NOT NULL,
    "insuranceGroupNumber" TEXT NOT NULL,
    "priorAuthApproved" BOOLEAN NOT NULL,
    "priorAuthId" TEXT NOT NULL,
    "priorAuthDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("insurance_id")
);

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "insurances"("insurance_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
