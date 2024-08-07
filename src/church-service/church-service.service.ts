import { Injectable } from '@nestjs/common';
import { ChurchServiceRepository } from './church-service.repository';
import { ChurchService } from '@prisma/client';
import { ChurchServiceDto } from './dtos';

@Injectable()
export class ChurchServiceService {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
  ) {}

  async findChurchServicesByChurchId(
    page: number,
    limit: number,
    churchId: number,
  ): Promise<{ data: ChurchService[]; total: number }> {
    return await this.churchServiceRepository.findChurchServicesByChurchId(
      page,
      limit,
      churchId,
    );
  }

  async findById(id: number): Promise<ChurchService> {
    return await this.churchServiceRepository.findChurchServiceById(id);
  }

  async create(data: ChurchServiceDto): Promise<ChurchService> {
    return await this.churchServiceRepository.createChurchService(data);
  }

  async update(id: number, data: Partial<ChurchServiceDto>) {
    return await this.churchServiceRepository.updateChurchService(id, data);
  }

  async delete(id: number): Promise<ChurchService> {
    return await this.churchServiceRepository.deleteChurchService(id);
  }
}
