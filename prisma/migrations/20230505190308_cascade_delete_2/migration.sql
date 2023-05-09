-- DropForeignKey
ALTER TABLE "serviceLine" DROP CONSTRAINT "serviceLine_procedureUnitId_fkey";

-- AddForeignKey
ALTER TABLE "serviceLine" ADD CONSTRAINT "serviceLine_procedureUnitId_fkey" FOREIGN KEY ("procedureUnitId") REFERENCES "procedureUnit"("procedure_unit_id") ON DELETE CASCADE ON UPDATE CASCADE;
