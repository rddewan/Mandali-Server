import { Module } from '@nestjs/common';
import FirebaseRepository from './firebase.repository';
import FirebaseService from './firebase.service';
import RepositoryError from 'src/common/errors/repository-error';

@Module({
  providers: [FirebaseRepository, FirebaseService, RepositoryError],
  exports: [FirebaseService],
})
export class FirebaseModule {}
