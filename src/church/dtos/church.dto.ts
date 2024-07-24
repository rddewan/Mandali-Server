import { IsNotEmpty, IsString } from 'class-validator';

export class ChurchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
