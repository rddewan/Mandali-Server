import { PrismaService } from 'src/prisma/prisma.service';
import { ChurchServiceDto } from './dtos';
import RepositoryError from 'src/common/errors/repository-error';
import { ChurchService } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChurchServiceRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async createChurchService(data: ChurchServiceDto): Promise<ChurchService> {
    try {
      return await this.prisma.churchService.create({
        data: {
          date: data.date,
          chairPerson: data.chairPerson,
          preacher: data.preacher,
          bibleReaders: data.bibleReaders,
          offering: data.offering,
          worship: data.worship,
          serviceType: data.serviceType,
          createdBy: data.createdBy,
          churchId: data.churchId,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async updateChurchService(id: number, data: Partial<ChurchServiceDto>) {
    try {
      return await this.prisma.churchService.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findChurchServiceById(id: number): Promise<ChurchService> {
    try {
      return await this.prisma.churchService.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findAllChurchService(
    page: number,
    limit: number,
    churchId: number,
  ): Promise<{ data: ChurchService[]; total: number }> {
    try {
      const data = await this.prisma.churchService.findMany({
        where: { churchId: churchId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          id: 'desc',
        },
      });

      const total = await this.prisma.churchService.count({
        where: { churchId: churchId },
      });

      return { data, total };
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async deleteChurchService(id: number): Promise<ChurchService> {
    try {
      return await this.prisma.churchService.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
