-- CreateTable
CREATE TABLE "providers" (
    "provider_id" SERIAL NOT NULL,
    "fhir_resource_id" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "location_name" TEXT,
    "address" TEXT,
    "service_line" TEXT,
    "email" TEXT,
    "create_time" TIMESTAMP(6),
    "update_time" TIMESTAMP(6),

    CONSTRAINT "providers_pkey" PRIMARY KEY ("provider_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "providers_fhir_resource_id_key" ON "providers"("fhir_resource_id");
