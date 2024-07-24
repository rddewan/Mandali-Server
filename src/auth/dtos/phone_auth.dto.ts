import { AuthType } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsInt,
  IsOptional,
} from 'class-validator';

export class PhoneAuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsInt()
  churchId: number;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  authType: AuthType;
}
