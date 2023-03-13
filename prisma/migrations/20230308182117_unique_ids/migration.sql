/*
  Warnings:

  - A unique constraint covering the columns `[admission_type_id]` on the table `admissionType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[case_id]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[financial_id]` on the table `financial` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[insurance_id]` on the table `insurance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[location_id]` on the table `locations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patient_id]` on the table `patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[prior_auth_approved_id]` on the table `priorAuthApproved` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[procedure_unit_id]` on the table `procedureUnits` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[provider_id]` on the table `providers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduling_id]` on the table `scheduling` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_line_id]` on the table `serviceLines` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sex_id]` on the table `sex` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[state_id]` on the table `state` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admissionType_admission_type_id_key" ON "admissionType"("admission_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_case_id_key" ON "cases"("case_id");

-- CreateIndex
CREATE UNIQUE INDEX "financial_financial_id_key" ON "financial"("financial_id");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_insurance_id_key" ON "insurance"("insurance_id");

-- CreateIndex
CREATE UNIQUE INDEX "locations_location_id_key" ON "locations"("location_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_patient_id_key" ON "patient"("patient_id");

-- CreateIndex
CREATE UNIQUE INDEX "priorAuthApproved_prior_auth_approved_id_key" ON "priorAuthApproved"("prior_auth_approved_id");

-- CreateIndex
CREATE UNIQUE INDEX "procedureUnits_procedure_unit_id_key" ON "procedureUnits"("procedure_unit_id");

-- CreateIndex
CREATE UNIQUE INDEX "providers_provider_id_key" ON "providers"("provider_id");

-- CreateIndex
CREATE UNIQUE INDEX "scheduling_scheduling_id_key" ON "scheduling"("scheduling_id");

-- CreateIndex
CREATE UNIQUE INDEX "serviceLines_service_line_id_key" ON "serviceLines"("service_line_id");

-- CreateIndex
CREATE UNIQUE INDEX "sex_sex_id_key" ON "sex"("sex_id");

-- CreateIndex
CREATE UNIQUE INDEX "state_state_id_key" ON "state"("state_id");
