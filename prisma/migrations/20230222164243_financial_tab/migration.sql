-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "procedure_unit_id" INTEGER,
ADD COLUMN     "service_line_id" INTEGER;

-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "date_of_birth" SET DATA TYPE TIMESTAMP(6);

-- CreateTable
CREATE TABLE "insurances" (
    "insurance_id" SERIAL NOT NULL,
    "insurance" TEXT,
    "insurance_group_name" TEXT,
    "insurance_group_number" TEXT,
    "prior_auth_approved" TEXT,
    "prior_auth_id" TEXT,
    "prior_auth_date" TIMESTAMP(6),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "case_id" INTEGER,

    CONSTRAINT "insurances_pkey" PRIMARY KEY ("insurance_id")
);

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_service_line_id_fkey" FOREIGN KEY ("service_line_id") REFERENCES "serviceLines"("service_line_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_procedure_unit_id_fkey" FOREIGN KEY ("procedure_unit_id") REFERENCES "procedureUnits"("procedure_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "insurances" ADD CONSTRAINT "insurances_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
