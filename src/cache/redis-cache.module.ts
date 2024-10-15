import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({  
  providers: [
    {
      provide: 'KEYV_INSTANCE',
      useFactory: async (configService: ConfigService) => {
        const redisUser = configService.get<string>('REDIS_USER', 'default');
        const redisPassword = configService.get<string>('REDIS_PASSWORD', '');
        const redisHost = configService.get<string>('REDIS_HOST', 'localhost');
        const redisPort = configService.get<string>('REDIS_PORT', '6379');
        const defaultTTL = parseInt(configService.get<string>('REDIS_CACHE_TTL', '300000'));

        const redisConnectionString = `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`;
        
        return new Keyv({
          store: new KeyvRedis(redisConnectionString),
          ttl: defaultTTL,
          namespace: 'mandali-cache',
        });
      },
      inject: [ConfigService],
    },
    RedisCacheService,
  ],
  exports: [ RedisCacheService, 'KEYV_INSTANCE'],
})
export class RedisCacheModule {}
