import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Prisma } from '@prisma/client';

@Injectable()
export default class RepositoryError {
  constructor() {}

  handleError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle known Prisma errors
      switch (error.code) {
        case 'P2002':
          // Unique constraint failed
          throw new ConflictException(
            `Unique constraint failed: ${error.meta.target}`,
          );
        case 'P2003':
          // Foreign key constraint failed
          throw new ConflictException(
            `Foreign key constraint failed: ${error.meta.field_name}`,
          );
        case 'P2025':
          // Record not found
          throw new NotFoundException(`Record not found: ${error.meta.cause}`);
        default:
          throw new InternalServerErrorException(
            `Database error: ${error.message}`,
          );
      }
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle Prisma validation errors
      throw new BadRequestException(
        `Validation error: Please check your input.`,
      );
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      // Handle Prisma rust panic errors
      throw new InternalServerErrorException(
        `Internal server error: ${error.message}`,
      );
    } else {
      if (error.message.includes('Invalid value for argument `date`')) {
        throw new BadRequestException(
          'Invalid date format. Please provide a valid ISO-8601 date.',
        );
      }
      // Handle unexpected errors
      throw error;
    }
  }
}
