import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChurchServicePaginationDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: number;
}
