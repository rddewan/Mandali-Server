import { Module } from '@nestjs/common';
import FirebaseRepository from './firebase.repository';
import FirebaseService from './firebase.service';

@Module({
  providers: [FirebaseRepository, FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
