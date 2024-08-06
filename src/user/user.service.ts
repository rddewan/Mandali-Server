import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserRoles(userId: number) {
    return this.userRepository.getUserRoles(userId);
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
}
