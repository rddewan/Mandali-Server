import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';
import RepositoryError from 'src/common/errors/repository-error';

@Injectable()
export default class FirebaseRepository {
  private firebaseAdmin: admin.app.App;

  constructor(private readonly repositoryError: RepositoryError) {
    this.initializeFirebaseAdmin();
  }

  private initializeFirebaseAdmin() {
    const firebaseConfig = {
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    };

    this.firebaseAdmin = admin.initializeApp(firebaseConfig);
  }

  async verifyIdToken(
    token: string,
    checkingRevoked = true,
  ): Promise<admin.auth.DecodedIdToken> {
    try {
      return await this.firebaseAdmin
        .auth()
        .verifyIdToken(token, checkingRevoked);
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.firebaseAdmin.auth().getUser(uid);
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async sendNotification(
    topic: string,
    payload: admin.messaging.MessagingPayload,
  ) {
    try {
      const response = await this.firebaseAdmin
        .messaging()
        .sendToTopic(topic, payload);

      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        success: false,
        message: 'Something went wrong. Failed to send notification.',
      };
    }
  }

  async deleteUser(uid: string) {
    try {
      await this.firebaseAdmin.auth().deleteUser(uid);
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

}
