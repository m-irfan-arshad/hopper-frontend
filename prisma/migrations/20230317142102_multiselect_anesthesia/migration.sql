/*
  Warnings:

  - You are about to drop the column `anesthesia_id` on the `procedureTab` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "procedureTab" DROP CONSTRAINT "procedureTab_anesthesia_id_fkey";

-- AlterTable
ALTER TABLE "procedureTab" DROP COLUMN "anesthesia_id";

-- CreateTable
CREATE TABLE "_anesthesiaToprocedureTab" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_anesthesiaToprocedureTab_AB_unique" ON "_anesthesiaToprocedureTab"("A", "B");

-- CreateIndex
CREATE INDEX "_anesthesiaToprocedureTab_B_index" ON "_anesthesiaToprocedureTab"("B");

-- AddForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" ADD CONSTRAINT "_anesthesiaToprocedureTab_A_fkey" FOREIGN KEY ("A") REFERENCES "anesthesia"("anesthesia_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_anesthesiaToprocedureTab" ADD CONSTRAINT "_anesthesiaToprocedureTab_B_fkey" FOREIGN KEY ("B") REFERENCES "procedureTab"("procedure_tab_id") ON DELETE CASCADE ON UPDATE CASCADE;
