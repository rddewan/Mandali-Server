import { Injectable } from '@nestjs/common';
import { ChurchRepository } from './church.repository';
import { Church } from '@prisma/client';
import { ChurchDto } from './dtos';
import { RedisCacheService } from 'src/cache/redis-cache.service';

@Injectable()
export class ChurchService {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private readonly redisCacheService: RedisCacheService
  ) {}

  async createChurch(data: Partial<ChurchDto>): Promise<Church> {
    
    const result  = await this.churchRepository.createChurch(data);

    // delete the cache data
    await this.redisCacheService.delete(`churchs`);

    return result;
  }

  async findChurchById(id: number): Promise<Church> {
    // get catch data
    const cacheData = await this.redisCacheService.get(`church-${id}`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData as Church;
    }

    const result =  await this.churchRepository.findChurchById(id);

    // set the cache data
    await this.redisCacheService.set(`church-${id}`, result);

    return result;
  }

  async findAll(): Promise<Church[]> {

    // get catch data
    const cacheData = await this.redisCacheService.get(`churchs`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData as Church[];
    }

    const result = await this.churchRepository.findAll();

    // set the cache data
    await this.redisCacheService.set(`churchs`, result);

    return result;
  }
}
