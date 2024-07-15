import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import RepositoryError from 'src/common/errors/repository-error';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  providers: [AuthRepository, AuthService, RepositoryError],
  controllers: [AuthController],
  imports: [FirebaseModule],
})
export class AuthModule {}
