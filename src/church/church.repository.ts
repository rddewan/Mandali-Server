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
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findAll(): Promise<Church[]> {
    try {
      return await this.prisma.church.findMany();
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
