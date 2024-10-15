import { Injectable } from '@nestjs/common';
import { ChurchServiceRepository } from './church-service.repository';
import { ChurchService } from '@prisma/client';
import { ChurchServiceDto } from './dtos';
import { RedisCacheService } from 'src/cache/redis-cache.service';

@Injectable()
export class ChurchServiceService {
  constructor(
    private readonly churchServiceRepository: ChurchServiceRepository,
    private readonly redisCacheService: RedisCacheService
  ) {}

  async findChurchServicesByChurchId(
    page: number,
    limit: number,
    churchId: number,
  ): Promise<{ data: ChurchService[]; total: number }> {
    // get catch data
    const cacheData = await this.redisCacheService.get(`church-${churchId}-services-${page}-${limit}`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData as { data: ChurchService[]; total: number };
    }

    // Fetch data from the database
    const data =  await this.churchServiceRepository.findChurchServicesByChurchId(
      page,
      limit,
      churchId,
    );

    // set the cache data
    await this.redisCacheService.set(`church-${churchId}-services-${page}-${limit}`, data);

    return data;
  }

  async findById(id: number, churchId: number): Promise<ChurchService> {
    // get catch data
    const cacheData = await this.redisCacheService.get(`church-${churchId}-service-${id}`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData as ChurchService;
    }

    // Fetch data from the database
    const data = await this.churchServiceRepository.findChurchServiceById(id);

    // set the cache data
    await this.redisCacheService.set(`church-${churchId}-service-${id}`, data);

    return data;
  }

  async create(data: ChurchServiceDto, churchId: number): Promise<ChurchService> {
    // delete cache data
    await this.redisCacheService.delete(`church-${churchId}-services-1-20`);
    // create service
    return await this.churchServiceRepository.createChurchService(data);
  }

  async update(data: Partial<ChurchServiceDto>) {
    // delete cache data
    await this.redisCacheService.delete(`church-${data.churchId}-services-1-20`);
    // update service
    return await this.churchServiceRepository.updateChurchService(data);
  }

  async delete(id: number): Promise<ChurchService> {
    return await this.churchServiceRepository.deleteChurchService(id);
  }
}
