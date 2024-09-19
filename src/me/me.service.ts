import { Inject, Injectable } from '@nestjs/common';
import { MeRepository } from './me.repository';
import { UpdateUserDto } from './dtos';
import { S3Service } from 'src/aws/s3/s3.service';
import { RoleType } from '@prisma/client';
import { MeResponse } from './types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MeService {
  constructor(
    private readonly meRepository: MeRepository,
    private readonly s3Service: S3Service,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async getUserRoles(userId: number, churchId: number) {
    // get catch data
    const cacheData = await this.cacheManager.get(`church-${churchId}-user-${userId}-roles`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData;
    }
    // Fetch users associated with the given userId
    const data = await this.meRepository.getUserRoles(userId);  

    // set the cache data
    await this.cacheManager.set(`church-${churchId}-user-${userId}-roles`, data);

    return data;

  }

  async getUserGuilds(userId: number, churchId: number) {
    // get catch data
    const cacheData = await this.cacheManager.get(`church-${churchId}-user-${userId}-guilds`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData;
    }

    // // Fetch users associated with the given userId
    const data = await this.meRepository.getUserGuilds(userId);

    // set the cache data
    await this.cacheManager.set(`church-${churchId}-user-${userId}-guilds`, data);

    return data;
  }

  async me(id: number, churchId: number): Promise<MeResponse> {
    // get catch data
    const cacheData = await this.cacheManager.get(`church-${churchId}-user-${id}-me`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData as MeResponse;
    }

    // // Fetch users associated with the given userId
    const user = await this.meRepository.me(id);
    // Get the signed URL for the user's photo if it exists
    const photo = user.photo
      ? await this.s3Service.getSignedUrl(user.photo, 3600)
      : null;

    // Check if the user has a 'member' role
    const hasMemberRole = user.roles.some(
      (role) => role.role.name === RoleType.member,
    );

    // Filter out the 'user' role if the user also has a 'member' role
    const roles = hasMemberRole
      ? user.roles.filter((role) => role.role.name !== RoleType.user)
      : user.roles;

    const data =  {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photo,
      role: roles.map((role) => ({
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
    await this.cacheManager.set(`church-${churchId}-user-${id}-me`, data);

    return data;
  }

  async deleteMe(userId: number) {
    return this.meRepository.deleteMe(userId);
  }

  async updateMe(userId: number, data: UpdateUserDto) {
    return this.meRepository.updateMe(userId, data);
  }
}
