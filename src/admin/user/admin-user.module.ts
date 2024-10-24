import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import RepositoryError from 'src/common/errors/repository-error';
import { AdminUserService } from './admin-user.service';
import { AdminUserRepository } from './admin-user.repository';
import { S3Module } from 'src/aws/s3/s3.module';

@Module({
  providers: [RepositoryError, AdminUserService, AdminUserRepository],
  controllers: [AdminUserController],
  imports: [S3Module],
})
export class AdminUserModule {}
