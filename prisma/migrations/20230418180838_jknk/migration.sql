-- AlterTable
ALTER TABLE "clearanceForm" ALTER COLUMN "at_procedure_location" DROP DEFAULT;

-- AlterTable
ALTER TABLE "clinical" ALTER COLUMN "pre_op_required" DROP DEFAULT,
ALTER COLUMN "diagnostic_tests_required" DROP DEFAULT,
ALTER COLUMN "clearance_required" DROP DEFAULT;

-- AlterTable
ALTER TABLE "diagnosticTestForm" ALTER COLUMN "at_procedure_location" DROP DEFAULT;

-- AlterTable
ALTER TABLE "preOpForm" ALTER COLUMN "at_procedure_location" DROP DEFAULT;
