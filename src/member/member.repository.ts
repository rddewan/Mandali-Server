import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthType } from '@prisma/client';
import RepositoryError from 'src/common/errors/repository-error';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async findMembersById(id: number) {
    try {
      const member = await this.prisma.user.findUnique({
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

      if (member === null) {
        throw new NotFoundException('Member not found');
      }

      return member;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findMembersByChurchId(churchId: number) {
    try {
      const members = await this.prisma.user.findMany({
        where: {
          churchId,
          authType: { not: AuthType.email },
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
      return members;
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
