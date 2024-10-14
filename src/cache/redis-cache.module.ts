import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CacheModule, CacheModuleOptions } from '@nestjs/cache-manager';


@Global()
@Module({
  imports: [
    CacheModule.registerAsync<CacheModuleOptions>({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUser = configService.get<string>('REDIS_USER', 'default');
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '');
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<string>('REDIS_PORT', '6379');
        const defaultTTL = configService.get<number>('REDIS_CACHE_TTL', 300000);

        const redisConnectionString = `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`;

        const keyv = new Keyv({
          store: new KeyvRedis(redisConnectionString),
          namespace: 'mandali-cache',
          ttl: defaultTTL,
        });

        return {
          store: {
            get: async (key: string) => {
              const value = await keyv.get(key);
              return value;
            },
            set: async (key: string, value: any, options?: { ttl?: number }) => {
              const ttl = options?.ttl !== undefined ? options.ttl : defaultTTL;              
              return keyv.set(key, value, ttl);
            },
            del: (key: string) => {
              return keyv.delete(key);
            },
          },
      
    }
      },
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}