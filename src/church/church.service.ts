import { Injectable } from '@nestjs/common';
import { ChurchRepository } from './church.repository';
import { Church } from '@prisma/client';
import { ChurchDto } from './dtos';

@Injectable()
export class ChurchService {
  constructor(private readonly churchRepository: ChurchRepository) {}

  async createChurch(data: Partial<ChurchDto>): Promise<Church> {
    return await this.churchRepository.createChurch(data);
  }

  async findChurchById(id: number): Promise<Church> {
    return await this.churchRepository.findChurchById(id);
  }

  async findAll(): Promise<Church[]> {
    return await this.churchRepository.findAll();
  }
}
