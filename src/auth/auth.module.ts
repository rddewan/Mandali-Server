import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import RepositoryError from 'src/common/errors/repository-error';

@Module({
  providers: [AuthRepository, AuthService, RepositoryError],
  controllers: [AuthController],
})
export class AuthModule {}
