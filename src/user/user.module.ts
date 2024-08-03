import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import RepositoryError from 'src/common/errors/repository-error';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService, RepositoryError],
})
export class UserModule {}
