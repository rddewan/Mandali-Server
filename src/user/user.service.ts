import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dtos';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserRoles(userId: number) {
    return await this.userRepository.getUserRoles(userId);
  }

  async me(id: number) {
    const user = await this.userRepository.me(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.roles.map((role) => role.role),
      church: user.church,
    };
  }

  async deleteMe(userId: number) {
    return this.userRepository.deleteMe(userId);
  }

  async updateMe(userId: number, data: UpdateUserDto) {
    return this.userRepository.updateMe(userId, data);
  }
}
