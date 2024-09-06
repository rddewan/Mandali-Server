import { Module } from '@nestjs/common';
import { AdminUserController } from './admin-user.controller';
import RepositoryError from 'src/common/errors/repository-error';
import { AdminUserService } from './admin-user.service';
import { AdminUserRepository } from './admin-user.repository';

@Module({
  providers: [RepositoryError, AdminUserService, AdminUserRepository],
  controllers: [AdminUserController],
  imports: [],
})
export class AdminUserModule {}
