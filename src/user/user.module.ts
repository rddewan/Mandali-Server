import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import RepositoryError from 'src/common/errors/repository-error';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService, RepositoryError],
  imports: [FirebaseModule],
})
export class UserModule {}
