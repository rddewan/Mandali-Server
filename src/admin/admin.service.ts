import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}

  async setUserRole(userId: number, roleId: number) {
    return await this.adminRepository.setUserRole(userId, roleId);
  }

  async deleteUserRole(userId: number, roleId: number) {
    return await this.adminRepository.deleteUserRole(userId, roleId);
  }
}
