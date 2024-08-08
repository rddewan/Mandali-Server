import { Injectable } from '@nestjs/common';
import RepositoryError from 'src/common/errors/repository-error';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async getUserRoles(userId: number) {
    try {
      const userWithRoles = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
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

      return userWithRoles.roles.map((userRole) => userRole.role);
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async me(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
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
          church: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return user;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async deleteMe(userId: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async updateMe(userId: number, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: data.name,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
