import { Injectable } from '@nestjs/common';
import { AdminUserRepository } from './admin-user.repository';

@Injectable()
export class AdminUserService {
  constructor(private readonly adminUserRepository: AdminUserRepository) {}

  async findUserbyChurch(churchId: number) {
    return await this.adminUserRepository.findUserByChurch(churchId);
  }

  async setUserRole(userId: number, roleId: number) {
    return await this.adminUserRepository.setUserRole(userId, roleId);
  }

  async deleteUserRole(userId: number, roleId: number) {
    return await this.adminUserRepository.deleteUserRole(userId, roleId);
  }

  async setUserGuild(userId: number, guildId: number) {
    return await this.adminUserRepository.setUserGuild(userId, guildId);
  }

  async deleteUserGuild(userId: number, guildId: number) {
    return await this.adminUserRepository.deleteUserGuild(userId, guildId);
  }
}
