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
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { S3Module } from './aws/s3/s3.module';
import { ChurchSettingModule } from './church-setting/church-setting.module';
import { MeModule } from './me/me.module';

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
    UserModule,
    MeModule,
    AdminModule,
    S3Module,
    ChurchSettingModule,
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
