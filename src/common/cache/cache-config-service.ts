import { CacheModuleOptions, CacheOptionsFactory } from "@nestjs/cache-manager";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";


@Injectable()
export class CacheConfigService implements CacheOptionsFactory {

    constructor(private readonly configService: ConfigService) {}

  createCacheOptions(): CacheModuleOptions {
    const ttl: number = this.configService.get<number>('REDIS_CACHE_TTL');
    const host: string = this.configService.get<string>('REDIS_HOST');
    const port: number = this.configService.get<number>('REDIS_PORT');

    return {
      ttl: ttl,
      socket: {
        host: host,
        port: port,
      },
      store: redisStore,
    };
  }
}