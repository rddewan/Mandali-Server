import { IsNotEmpty, IsString } from 'class-validator';
import { ChurchSettingDto } from './church-setting.dto';

export class ChurchDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  churchSetting: ChurchSettingDto;
}
