import { Injectable, Inject } from '@nestjs/common';
import { Keyv } from 'keyv';

@Injectable()
export class RedisCacheService {
  constructor(@Inject('KEYV_INSTANCE') private readonly keyv: Keyv) {}

  async get(key: string): Promise<any> {
    return await this.keyv.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.keyv.set(key, value, ttl ?? undefined);
  }

  async delete(key: string): Promise<void> {
    await this.keyv.delete(key);
  }
}
