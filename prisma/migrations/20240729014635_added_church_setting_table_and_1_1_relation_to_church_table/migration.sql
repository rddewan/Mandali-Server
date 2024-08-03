-- CreateTable
CREATE TABLE "church_setting" (
    "id" SERIAL NOT NULL,
    "churchId" INTEGER NOT NULL,
    "timeZone" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "church_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "church_setting_churchId_key" ON "church_setting"("churchId");

-- AddForeignKey
ALTER TABLE "church_setting" ADD CONSTRAINT "church_setting_churchId_fkey" FOREIGN KEY ("churchId") REFERENCES "churchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
