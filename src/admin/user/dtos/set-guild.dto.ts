import { IsNumber, IsNotEmpty } from 'class-validator';

export class SetGuildDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  guildId: number;
}
