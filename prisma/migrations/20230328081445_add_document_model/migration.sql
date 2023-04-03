-- CreateTable
CREATE TABLE "document" (
    "document_id" SERIAL NOT NULL,
    "document_types" TEXT[],
    "notes" TEXT DEFAULT '',
    "user" TEXT NOT NULL,
    "case_id" INTEGER,
    "storage_path" TEXT NOT NULL,
    "signiture_date" TIMESTAMP(3),
    "create_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "update_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_pkey" PRIMARY KEY ("document_id")
);

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
