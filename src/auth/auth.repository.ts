import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthType, RoleType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dtos';
import RepositroyError from 'src/common/errors/repository-error';

@Injectable()
export class AuthRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositroyError,
  ) {}

  async findUserByPhoneNumber(
    phoneNumber: string,
    email: string,
  ): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          phoneNumber,
          email,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new NotFoundException('user or password not found');
      }

      return user;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findUserById(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new NotFoundException('user or password not found');
      }

      return user;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async deleteRefreshToken(refreshToken: string) {
    try {
      await this.prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async createUser(data: AuthDto | Record<string, any>): Promise<User> {
    try {
      const passwordHash = await this.hashPassword(data.password);
      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: passwordHash,
          authType: AuthType.email,
          churchId: data.churchId,
          roles: {
            create: [
              { role: { connect: { name: RoleType.admin } } },
              { role: { connect: { name: RoleType.user } } },
            ],
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
