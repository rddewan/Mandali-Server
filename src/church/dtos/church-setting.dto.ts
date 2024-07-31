import { IsNotEmpty, IsString } from 'class-validator';

export class ChurchSettingDto {
  @IsNotEmpty()
  @IsString()
  timeZone: string;
}
