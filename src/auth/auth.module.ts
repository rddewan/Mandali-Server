import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import RepositoryError from 'src/common/errors/repository-error';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ChurchSettingModule } from 'src/church-setting/church-setting.module';
import { S3Module } from 'src/aws/s3/s3.module';

@Module({
  providers: [AuthRepository, AuthService, RepositoryError],
  controllers: [AuthController],
  imports: [FirebaseModule, ChurchSettingModule, S3Module],
})
export class AuthModule {}
