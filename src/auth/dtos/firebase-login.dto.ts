import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class FirebaseLoginDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNumber()
  @IsNotEmpty()
  churchId: number;
}
