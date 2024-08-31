import { Injectable } from '@nestjs/common';
import RepositoryError from 'src/common/errors/repository-error';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChurchSettingRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async findById(id: number) {
    try {
      return await this.prisma.churchSetting.findUnique({
        where: { churchId: id },
        select: {
          id: true,
          churchId: true,
          timeZone: true,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
