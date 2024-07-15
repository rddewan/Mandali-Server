import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export default class FirebaseRepository {
  private firebaseAdmin: admin.app.App;

  constructor() {
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
      this.throwError(error);
    }
  }

  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    try {
      return await this.firebaseAdmin.auth().getUser(uid);
    } catch (error) {
      this.throwError(error);
    }
  }

  private throwError(error: any) {
    // https://firebase.google.com/docs/auth/admin/errors
    if (error instanceof Error) {
      const err = error as Error & { code?: string | number };

      if (
        err.code &&
        typeof err.code === 'string' &&
        err.code.startsWith('auth/id-token-expired')
      ) {
        throw new UnauthorizedException(
          'Firebase id token has aexpired. Please login again',
        );
      } else if (
        err.code &&
        typeof err.code === 'string' &&
        err.code.startsWith('auth/id-token-revoked')
      ) {
        throw new UnauthorizedException(
          'Firebase id token revoked. Please login again',
        );
      } else if (
        err.code &&
        typeof err.code === 'string' &&
        err.code.startsWith('auth/user-disabled')
      ) {
        throw new UnauthorizedException(
          'Firebase user is disabled. Please login again',
        );
      } else if (
        err.code &&
        typeof err.code === 'string' &&
        err.code.startsWith('auth/user-not-found 	')
      ) {
        throw new UnauthorizedException(
          'There is no existing user record corresponding to the provided identifier.',
        );
      } else {
        throw new InternalServerErrorException(
          'Something went wrong. Please try again',
        );
      }
    }
  }
}
