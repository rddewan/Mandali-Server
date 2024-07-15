import { IsString, IsNotEmpty, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,20}$/,
    {
      message:
        'Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be 8-20 characters long',
    },
  )
  password: string;
}
