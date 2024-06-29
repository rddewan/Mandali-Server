import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsInt,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,20}$/,
    {
      message:
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be 8-20 characters long',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsInt()
  churchId: number;
}
