import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthType, RoleType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthDto, PhoneAuthDto } from './dtos';
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
        include: {
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

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
        include: {
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
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

  async findUserById(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
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

  async createUser(data: AuthDto): Promise<User> {
    try {
      const passwordHash = await this.hashPassword(data.password);
      console.log(passwordHash);

      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash: passwordHash,
          authType: AuthType.email,
          churchId: data.churchId,
          roles: {
            create: [{ role: { connect: { name: RoleType.admin } } }],
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async createAdminUser(data: AuthDto): Promise<User> {
    try {
      const passwordHash = await this.hashPassword(data.password);
      console.log(passwordHash);

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

  /**
   * Creates a new user with phone authentication or updates an existing user with the same phone number.
   *
   * @param {PhoneAuthDto} data - The data containing the user's name, email, phone number, authentication type, and church ID.
   * @return {Promise<User>} A promise that resolves to the created or updated user.
   */
  async createPhoneAuthUser(data: PhoneAuthDto): Promise<User> {
    try {
      return await this.prisma.user.upsert({
        where: {
          phoneNumber: data.phoneNumber,
        },
        update: {
          name: data.name,
          email: data.email,
          authType: data.authType,
          phoneNumber: data.phoneNumber,
          churchId: data.churchId,
          roles: {
            create: [{ role: { connect: { name: RoleType.user } } }],
          },
        },
        create: {
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          authType: data.authType,
          churchId: data.churchId,
          roles: {
            create: [{ role: { connect: { name: RoleType.user } } }],
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
