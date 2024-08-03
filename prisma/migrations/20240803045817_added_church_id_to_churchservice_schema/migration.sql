/*
  Warnings:

  - Added the required column `churchId` to the `church_services` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "church_services" ADD COLUMN     "churchId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "church_services" ADD CONSTRAINT "church_services_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
