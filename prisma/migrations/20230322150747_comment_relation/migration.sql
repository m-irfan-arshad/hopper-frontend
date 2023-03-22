-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "case_id" INTEGER;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "cases"("case_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
