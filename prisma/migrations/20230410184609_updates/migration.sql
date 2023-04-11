/*
  Warnings:

  - A unique constraint covering the columns `[clinical_tab_id]` on the table `cases` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clinical_tab_id` to the `cases` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "clinical_tab_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cases_clinical_tab_id_key" ON "cases"("clinical_tab_id");

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_clinical_tab_id_fkey" FOREIGN KEY ("clinical_tab_id") REFERENCES "clinicalTab"("clinical_tab_id") ON DELETE RESTRICT ON UPDATE CASCADE;
