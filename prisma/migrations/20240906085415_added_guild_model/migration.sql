-- CreateEnum
CREATE TYPE "GuildType" AS ENUM ('men', 'women', 'youth', 'children');

-- CreateTable
CREATE TABLE "guilds" (
    "id" SERIAL NOT NULL,
    "name" "GuildType" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_guild" (
    "userId" INTEGER NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "user_guild_pkey" PRIMARY KEY ("userId","guildId")
);

-- CreateIndex
CREATE UNIQUE INDEX "guilds_name_key" ON "guilds"("name");

-- AddForeignKey
ALTER TABLE "user_guild" ADD CONSTRAINT "user_guild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_guild" ADD CONSTRAINT "user_guild_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
