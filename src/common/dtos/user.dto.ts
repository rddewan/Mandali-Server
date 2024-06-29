import { AuthType, UserRole } from '@prisma/client';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
  @Expose()
  phoneNumber?: string;
  @Expose()
  authType: AuthType;
  @Expose()
  role: UserRole;
}
