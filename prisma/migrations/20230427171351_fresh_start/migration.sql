-- CreateTable
CREATE TABLE "cases" (
    "case_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "patient_id" INTEGER NOT NULL,
    "scheduling_id" INTEGER NOT NULL,
    "procedure_tab_id" INTEGER NOT NULL,
    "clinical_tab_id" INTEGER NOT NULL,
    "vendor_confirmation" TEXT NOT NULL DEFAULT 'Incomplete',

    CONSTRAINT "cases_pkey" PRIMARY KEY ("case_id")
);

-- CreateTable
CREATE TABLE "comment" (
    "comment_id" SERIAL NOT NULL,
    "comment_text" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "case_id" INTEGER,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "document" (
    "document_id" SERIAL NOT NULL,
    "document_types" TEXT[],
    "notes" TEXT DEFAULT '',
    "user" TEXT NOT NULL,
    "case_id" INTEGER,
    "storage_path" TEXT NOT NULL,
    "signature_date" TIMESTAMP(3),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "patient" (
    "patient_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "first_name" TEXT DEFAULT '',
    "middle_name" TEXT DEFAULT '',
    "last_name" TEXT DEFAULT '',
    "mrn" TEXT DEFAULT '',
    "address" TEXT DEFAULT '',
    "city" TEXT DEFAULT '',
    "state_id" INTEGER,
    "zip" TEXT DEFAULT '',
    "sex_id" INTEGER,
    "mobile_phone" TEXT DEFAULT '',
    "home_phone" TEXT DEFAULT '',
    "date_of_birth" TIMESTAMP(6),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("patient_id")
);

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
CREATE TABLE "scheduling" (
    "scheduling_id" SERIAL NOT NULL,
    "admission_type_id" INTEGER,
    "location_id" INTEGER,
    "procedure_unit_id" INTEGER,
    "service_line_id" INTEGER,
    "provider_id" INTEGER,
    "procedure_date" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "scheduling_pkey" PRIMARY KEY ("scheduling_id")
);

-- CreateTable
CREATE TABLE "admissionType" (
    "admission_type_id" SERIAL NOT NULL,
    "admissionTypeName" TEXT NOT NULL,

    CONSTRAINT "admissionType_pkey" PRIMARY KEY ("admission_type_id")
);

-- CreateTable
CREATE TABLE "location" (
    "location_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "location_name" TEXT NOT NULL,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "procedureUnit" (
    "procedure_unit_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "procedure_unit_name" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,

    CONSTRAINT "procedureUnit_pkey" PRIMARY KEY ("procedure_unit_id")
);

-- CreateTable
CREATE TABLE "serviceLine" (
    "service_line_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "service_line_name" TEXT NOT NULL,
    "procedureUnitId" INTEGER NOT NULL,

    CONSTRAINT "serviceLine_pkey" PRIMARY KEY ("service_line_id")
);

-- CreateTable
CREATE TABLE "provider" (
    "provider_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "address" TEXT,
    "email" TEXT,
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("provider_id")
);

-- CreateTable
CREATE TABLE "ServiceLineToProvider" (
    "serviceLineId" INTEGER NOT NULL,
    "providerId" INTEGER NOT NULL,

    CONSTRAINT "ServiceLineToProvider_pkey" PRIMARY KEY ("serviceLineId","providerId")
);

-- CreateTable
CREATE TABLE "financial" (
    "financial_id" SERIAL NOT NULL,
    "insurance_id" INTEGER,
    "insurance_group_name" TEXT DEFAULT '',
    "insurance_group_number" TEXT DEFAULT '',
    "prior_authorization" TEXT NOT NULL DEFAULT 'Incomplete',
    "prior_auth_id" TEXT DEFAULT '',
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
CREATE TABLE "procedureTab" (
    "procedure_tab_id" SERIAL NOT NULL,
    "procedure_id" INTEGER,
    "approach_id" INTEGER,
    "laterality_id" INTEGER,
    "cpt_code_id" INTEGER,
    "icd_code_id" INTEGER,
    "case_id" INTEGER,
    "anesthesia_notes" TEXT DEFAULT '',

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

-- CreateTable
CREATE TABLE "clinical" (
    "clinical_id" SERIAL NOT NULL,
    "physician_first_name" TEXT DEFAULT '',
    "physician_last_name" TEXT DEFAULT '',
    "physician_phone" TEXT DEFAULT '',
    "pre_op_required" TEXT,
    "diagnostic_tests_required" TEXT,
    "clearance_required" TEXT,
    "post_op_date_time" TIMESTAMP(6),
    "pre_op_form_id" INTEGER,

    CONSTRAINT "clinical_pkey" PRIMARY KEY ("clinical_id")
);

-- CreateTable
CREATE TABLE "preOpForm" (
    "pre_op_form_id" SERIAL NOT NULL,
    "clinical_id" INTEGER,
    "pre_op_date_time" TIMESTAMP(6),
    "at_procedure_location" BOOLEAN,
    "facility_id" INTEGER,

    CONSTRAINT "preOpForm_pkey" PRIMARY KEY ("pre_op_form_id")
);

-- CreateTable
CREATE TABLE "facility" (
    "facility_id" SERIAL NOT NULL,
    "facility_name" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "address_one" TEXT NOT NULL DEFAULT '',
    "address_two" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT '',
    "zip" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "facility_pkey" PRIMARY KEY ("facility_id")
);

-- CreateTable
CREATE TABLE "diagnosticTestForm" (
    "diagnostic_test_form_id" SERIAL NOT NULL,
    "diagnostic_test_id" INTEGER,
    "clinical_id" INTEGER,
    "test_name_other" TEXT DEFAULT '',
    "test_date_time" TIMESTAMP(6),
    "at_procedure_location" BOOLEAN,
    "facility_id" INTEGER,

    CONSTRAINT "diagnosticTestForm_pkey" PRIMARY KEY ("diagnostic_test_form_id")
);

-- CreateTable
CREATE TABLE "diagnosticTest" (
    "diagnostic_test_id" SERIAL NOT NULL,
    "test_name" TEXT NOT NULL,

    CONSTRAINT "diagnosticTest_pkey" PRIMARY KEY ("diagnostic_test_id")
);

-- CreateTable
CREATE TABLE "clearanceForm" (
    "clearance_form_id" SERIAL NOT NULL,
    "clearance_id" INTEGER,
    "clinical_id" INTEGER,
    "clearance_name_other" TEXT DEFAULT '',
    "clearance_date_time" TIMESTAMP(6),
    "physician_first_name" TEXT DEFAULT '',
    "physician_last_name" TEXT DEFAULT '',
    "physician_phone" TEXT DEFAULT '',
    "at_procedure_location" BOOLEAN,
    "facility_id" INTEGER,

    CONSTRAINT "clearanceForm_pkey" PRIMARY KEY ("clearance_form_id")
);

-- CreateTable
CREATE TABLE "clearance" (
    "clearance_id" SERIAL NOT NULL,
    "clearance_name" TEXT NOT NULL,

    CONSTRAINT "clearance_pkey" PRIMARY KEY ("clearance_id")
);

-- CreateTable
CREATE TABLE "_anesthesiaToprocedureTab" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_fhir_resource_id_key" ON "cases"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_scheduling_id_key" ON "cases"("scheduling_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_procedure_tab_id_key" ON "cases"("procedure_tab_id");

-- CreateIndex
CREATE UNIQUE INDEX "cases_clinical_tab_id_key" ON "cases"("clinical_tab_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_fhir_resource_id_key" ON "patient"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "location_fhir_resource_id_key" ON "location"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "procedureUnit_fhir_resource_id_key" ON "procedureUnit"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "serviceLine_fhir_resource_id_key" ON "serviceLine"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "provider_fhir_resource_id_key" ON "provider"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "_anesthesiaToprocedureTab_AB_unique" ON "_anesthesiaToprocedureTab"("A", "B");

-- CreateIndex
CREATE INDEX "_anesthesiaToprocedureTab_B_index" ON "_anesthesiaToprocedureTab"("B");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_scheduling_id_fkey" FOREIGN KEY ("scheduling_id") REFERENCES "scheduling"("scheduling_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_procedure_tab_id_fkey" FOREIGN KEY ("procedure_tab_id") REFERENCES "procedureTab"("procedure_tab_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_clinical_tab_id_fkey" FOREIGN KEY ("clinical_tab_id") REFERENCES "clinical"("clinical_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_sex_id_fkey" FOREIGN KEY ("sex_id") REFERENCES "sex"("sex_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "state"("state_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_admission_type_id_fkey" FOREIGN KEY ("admission_type_id") REFERENCES "admissionType"("admission_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_procedure_unit_id_fkey" FOREIGN KEY ("procedure_unit_id") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_service_line_id_fkey" FOREIGN KEY ("service_line_id") REFERENCES "serviceLine"("service_line_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "scheduling" ADD CONSTRAINT "scheduling_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureUnit" ADD CONSTRAINT "procedureUnit_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceLine" ADD CONSTRAINT "serviceLine_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_serviceLineId_fkey" FOREIGN KEY ("serviceLineId") REFERENCES "serviceLine"("service_line_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceLineToProvider" ADD CONSTRAINT "ServiceLineToProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("provider_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "financial" ADD CONSTRAINT "financial_insurance_id_fkey" FOREIGN KEY ("insurance_id") REFERENCES "insurance"("insurance_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_procedure_id_fkey" FOREIGN KEY ("procedure_id") REFERENCES "procedure"("procedure_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_approach_id_fkey" FOREIGN KEY ("approach_id") REFERENCES "approach"("approach_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_laterality_id_fkey" FOREIGN KEY ("laterality_id") REFERENCES "laterality"("laterality_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_cpt_code_id_fkey" FOREIGN KEY ("cpt_code_id") REFERENCES "cptCode"("cpt_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "procedureTab" ADD CONSTRAINT "procedureTab_icd_code_id_fkey" FOREIGN KEY ("icd_code_id") REFERENCES "icdCode"("icd_code_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clinical" ADD CONSTRAINT "clinical_pre_op_form_id_fkey" FOREIGN KEY ("pre_op_form_id") REFERENCES "preOpForm"("pre_op_form_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preOpForm" ADD CONSTRAINT "preOpForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_clinical_id_fkey" FOREIGN KEY ("clinical_id") REFERENCES "clinical"("clinical_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnosticTestForm" ADD CONSTRAINT "diagnosticTestForm_diagnostic_test_id_fkey" FOREIGN KEY ("diagnostic_test_id") REFERENCES "diagnosticTest"("diagnostic_test_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_clearance_id_fkey" FOREIGN KEY ("clearance_id") REFERENCES "clearance"("clearance_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clearanceForm" ADD CONSTRAINT "clearanceForm_clinical_id_fkey" FOREIGN KEY ("clinical_id") REFERENCES "clinical"("clinical_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" ADD CONSTRAINT "_anesthesiaToprocedureTab_A_fkey" FOREIGN KEY ("A") REFERENCES "anesthesia"("anesthesia_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" ADD CONSTRAINT "_anesthesiaToprocedureTab_B_fkey" FOREIGN KEY ("B") REFERENCES "procedureTab"("procedure_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;
