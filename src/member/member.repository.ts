import { Injectable } from '@nestjs/common';
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
    return member;
  }

  async findMembersByChurchId(churchId: number) {
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
  }
}
