-- AlterTable
ALTER TABLE "financial" ALTER COLUMN "insurance_group_name" SET DEFAULT '',
ALTER COLUMN "insurance_group_number" SET DEFAULT '',
ALTER COLUMN "prior_auth_id" SET DEFAULT '';

-- AlterTable
ALTER TABLE "patient" ALTER COLUMN "first_name" SET DEFAULT '',
ALTER COLUMN "middle_name" SET DEFAULT '',
ALTER COLUMN "last_name" SET DEFAULT '',
ALTER COLUMN "mrn" SET DEFAULT '',
ALTER COLUMN "address" SET DEFAULT '',
ALTER COLUMN "city" SET DEFAULT '',
ALTER COLUMN "zip" SET DEFAULT '',
ALTER COLUMN "mobile_phone" SET DEFAULT '',
ALTER COLUMN "home_phone" SET DEFAULT '';

-- AlterTable
ALTER TABLE "procedureTab" ALTER COLUMN "anesthesia_notes" SET DEFAULT '';

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

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
