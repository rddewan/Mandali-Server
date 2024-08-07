import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import RepositoryError from 'src/common/errors/repository-error';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';

@Module({
  providers: [RepositoryError, AdminService, AdminRepository],
  controllers: [AdminController],
  imports: [],
})
export class AdminModule {}
