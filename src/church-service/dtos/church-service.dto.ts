import { ServiceType } from '@prisma/client';

import {
  IsNotEmpty,
  IsString,
  IsDateString,
  IsArray,
  IsNumber,
  IsOptional,
  IsEnum,
} from 'class-validator';

export class ChurchServiceDto {
  @IsOptional()
  id: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsString()
  chairPerson: string;

  @IsNotEmpty()
  @IsString()
  preacher: string;

  @IsArray()
  @IsOptional() // Make sure this is optional if it is not always provided
  @IsString({ each: true }) // Ensure each item in the array is a string
  bibleReaders?: string[];

  @IsOptional()
  offering: string;

  @IsOptional()
  worship: string;

  @IsNotEmpty()
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsNotEmpty()
  @IsNumber()
  createdBy: number;

  @IsNotEmpty()
  @IsNumber()
  churchId: number;
}
