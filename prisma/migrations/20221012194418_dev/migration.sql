-- CreateTable
CREATE TABLE "cases" (
    "case_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "patient_id" INTEGER,
    "procedure_date" TIMESTAMP(6) NOT NULL,
    "provider_name" TEXT,
    "location_name" TEXT,
    "create_time" TIMESTAMP(6),
    "update_time" TIMESTAMP(6),

    CONSTRAINT "cases_pkey" PRIMARY KEY ("case_id")
);

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "mrn" TEXT,
    "address" TEXT,
    "mobile_phone" TEXT,
    "home_phone" TEXT,
    "date_of_birth" DATE,
    "create_time" TIMESTAMP(6),
    "update_time" TIMESTAMP(6),

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cases_fhir_resource_id_key" ON "cases"("fhir_resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_fhir_resource_id_key" ON "patients"("fhir_resource_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
