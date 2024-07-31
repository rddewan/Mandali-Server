import { Injectable } from '@nestjs/common';
import RepositoryError from 'src/common/errors/repository-error';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async getUserRoles(userId: number) {
    try {
      return this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          roles: {
            select: {
              role: true,
            },
          },
        },
      });
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
      });

      return user;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
