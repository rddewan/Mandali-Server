import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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
      // https://firebase.google.com/docs/auth/admin/errors
      if (error instanceof Error) {
        const err = error as Error & { code?: string | number };

        if (
          err.code &&
          typeof err.code === 'string' &&
          err.code.startsWith('auth/id-token-expired')
        ) {
          throw new UnauthorizedException(
            'Firebase id token has aexpired. Please login again',
          );
        } else if (
          err.code &&
          typeof err.code === 'string' &&
          err.code.startsWith('auth/id-token-revoked')
        ) {
          throw new UnauthorizedException(
            'Firebase id token revoked. Please login again',
          );
        } else if (
          err.code &&
          typeof err.code === 'string' &&
          err.code.startsWith('auth/user-disabled')
        ) {
          throw new UnauthorizedException(
            'Firebase user is disabled. Please login again',
          );
        } else if (
          err.code &&
          typeof err.code === 'string' &&
          err.code.startsWith('auth/user-not-found 	')
        ) {
          throw new UnauthorizedException(
            'There is no existing user record corresponding to the provided identifier.',
          );
        } else if (
          err.code &&
          typeof err.code === 'string' &&
          err.code.startsWith('messaging/')
        ) {
          throw new BadRequestException(
            'Something went wrong. Failed to send notification.',
          );
        } else {
          throw new InternalServerErrorException(
            'Something went wrong. Please try again',
          );
        }
      }
      // Handle unexpected errors
      throw error;
    }
  }
}
