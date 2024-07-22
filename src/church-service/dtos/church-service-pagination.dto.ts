import { IsNumber } from 'class-validator';

export class ChurchServicePaginationDto {
  @IsNumber()
  page: number;
  @IsNumber()
  limit: number;
}
