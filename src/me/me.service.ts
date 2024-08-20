import { Injectable } from '@nestjs/common';
import { MeRepository } from './me.repository';
import { UpdateUserDto } from './dtos';

@Injectable()
export class MeService {
  constructor(private readonly meRepository: MeRepository) {}

  async getUserRoles(userId: number) {
    return await this.meRepository.getUserRoles(userId);
  }

  async me(id: number) {
    const user = await this.meRepository.me(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.roles.map((role) => role.role),
      church: {
        id: user.church.id,
        name: user.church.name,
        timeZone: user.church.churchSetting.timeZone,
      },
    };
  }

  async deleteMe(userId: number) {
    return this.meRepository.deleteMe(userId);
  }

  async updateMe(userId: number, data: UpdateUserDto) {
    return this.meRepository.updateMe(userId, data);
  }
}
