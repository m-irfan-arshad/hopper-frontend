-- CreateTable
CREATE TABLE "provider_locations" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "provider_id" INTEGER NOT NULL,

    CONSTRAINT "provider_locations_pkey" PRIMARY KEY ("id")
);
