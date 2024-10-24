import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from './admin-user.repository';
import { S3Service } from 'src/aws/s3/s3.service';
import { RedisCacheService } from 'src/cache/redis-cache.service';

@Injectable()
export class AdminUserService {
  constructor(
    private readonly adminUserRepository: AdminUserRepository,
    private readonly s3Service: S3Service,
    private readonly redisCacheService: RedisCacheService
  ) {}

  async findUserbyChurch(churchId: number) {
    return await this.adminUserRepository.findUserByChurch(churchId);
  }

  async findUserById(id: number)  {
    // get catch data
    const cacheData = await this.redisCacheService.get(`user-${id}`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData;
    }

    const user = await this.adminUserRepository.findUserById(id);
    // Get the signed URL for the user's photo if it exists
    const photo = user.photo
      ? await this.s3Service.getSignedUrl(user.photo, 3600)
      : null;
   
    const data =  {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photo,
      role: user.roles.map((role) => ({
        id: role.role.id,
        name: role.role.name,
      })),
      guild: user.guilds.map((data) => ({
        id: data.guild.id,
        name: data.guild.name,
      })),
      church: {
        id: user.church.id,
        name: user.church.name,
        timeZone: user.church.churchSetting.timeZone,
      },
    };

    // set the cache data
    await this.redisCacheService.set(`user-${id}`, data);

    return data;
  }

  async setUserRole(userId: number, roleId: number) {
    // delete user from cache
    this.redisCacheService.delete(`user-${userId}`);

    // add user to role
    return await this.adminUserRepository.setUserRole(userId, roleId);
  }

  async deleteUserRole(userId: number, roleId: number) {
    // delete user from cache
    this.redisCacheService.delete(`user-${userId}`);

    // delete user from role
    return await this.adminUserRepository.deleteUserRole(userId, roleId);
  }

  async setUserGuild(userId: number, guildId: number) {
    // delete user from cache
    this.redisCacheService.delete(`user-${userId}`);

    // add user to guild
    return await this.adminUserRepository.setUserGuild(userId, guildId);
  }

  async deleteUserGuild(userId: number, guildId: number) {
    // delete user from cache
    this.redisCacheService.delete(`user-${userId}`);

    // delete user from guild
    return await this.adminUserRepository.deleteUserGuild(userId, guildId);
  }

  async deleteUserById(userId: number) {
    // delete user from cache
    this.redisCacheService.delete(`user-${userId}`);  
    // delete user from database
    return await this.adminUserRepository.deleteUserById(userId);
  }
}
