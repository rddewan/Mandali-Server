import { Injectable } from '@nestjs/common';
import FirebaseRepository from './firebase.repository';
import * as admin from 'firebase-admin';

@Injectable()
export default class FirebaseService {
  constructor(private readonly firebaseRepository: FirebaseRepository) {}

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.firebaseRepository.verifyIdToken(token);
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return this.firebaseRepository.getUser(uid);
  }

  async deleteUser(uid: string) {
    return this.firebaseRepository.deleteUser(uid);
  }

  async sendNotification(
    topic: string,
    payload: admin.messaging.MessagingPayload,
  ) {
    return this.firebaseRepository.sendNotification(topic, payload);
  }
}
