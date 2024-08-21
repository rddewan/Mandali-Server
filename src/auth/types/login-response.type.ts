import { Token } from './token.type';

export type LoginResponse = {
  token: Token;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    photo?: string;
    role: object;
    church: object;
  };
};
