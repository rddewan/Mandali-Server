-- DropForeignKey
ALTER TABLE "user_guild" DROP CONSTRAINT "user_guild_guildId_fkey";

-- DropForeignKey
ALTER TABLE "user_guild" DROP CONSTRAINT "user_guild_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_guild" ADD CONSTRAINT "user_guild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_guild" ADD CONSTRAINT "user_guild_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "guilds"("id") ON DELETE CASCADE ON UPDATE CASCADE;
