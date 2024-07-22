import { User } from '@prisma/client';

declare module 'express-serve-static-cor' {
  export interface Request {
    user: User;
  }
}
