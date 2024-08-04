import { Token } from './token.type';

export type LoginResponse = {
  token: Token;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    churchId: number;
    role: object;
  };
};
