import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ChurchServiceModule } from './church-service/church-service.module';
import { ChurchModule } from './church/church.module';
import { MemberModule } from './member/member.module';
import { S3Module } from './aws/s3/s3.module';
import { ChurchSettingModule } from './church-setting/church-setting.module';
import { MeModule } from './me/me.module';
import { AdminGuildModel } from './admin/guild/admin-guild.module';
import { AdminUserModule } from './admin/user/admin-user.module';
import { GuildModel } from './guild/guild.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheConfigService } from './common/cache/cache-config-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useClass: CacheConfigService,
    }),
    JwtModule.register({ global: true }),
    AuthModule,
    PrismaModule,
    ChurchServiceModule,
    ChurchModule,
    MemberModule,
    MeModule,
    AdminUserModule,
    S3Module,
    ChurchSettingModule,
    AdminGuildModel,
    GuildModel,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AppService,
  ],
})
export class AppModule {}
