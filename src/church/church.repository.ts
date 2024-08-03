import { Injectable } from '@nestjs/common';
import { Church } from '@prisma/client';
import RepositoryError from 'src/common/errors/repository-error';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChurchDto } from './dtos';

@Injectable()
export class ChurchRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async createChurch(data: Partial<ChurchDto>): Promise<Church> {
    try {
      return await this.prisma.church.create({
        data: {
          name: data.name,
          address: data.address,
          churchSetting: {
            create: {
              ...data.churchSetting,
            },
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findChurchById(id: number): Promise<Church> {
    try {
      return await this.prisma.church.findUnique({
        where: {
          id,
        },
        include: {
          churchSetting: {
            select: {
              timeZone: true,
            },
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findAll(): Promise<Church[]> {
    try {
      return await this.prisma.church.findMany({
        include: {
          churchSetting: {
            select: {
              timeZone: true,
            },
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
