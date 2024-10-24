import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
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
import { RedisCacheModule} from './cache/redis-cache.module';
import { AdminRoleModule } from './admin/role/admin-role.module';
import { Auth } from 'firebase-admin/lib/auth/auth';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
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
    RedisCacheModule,
    AdminRoleModule,
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
