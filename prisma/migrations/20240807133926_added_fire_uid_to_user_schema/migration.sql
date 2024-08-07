/*
  Warnings:

  - A unique constraint covering the columns `[firebaseUID]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firebaseUID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUID_key" ON "users"("firebaseUID");
