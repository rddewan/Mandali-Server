import { Token } from './token.type';

export type LoginResponse = {
  token: Token;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: object;
    church: object;
  };
};
