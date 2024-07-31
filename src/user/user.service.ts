import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/common/dtos';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUserRoles(userId: number) {
    return this.userRepository.getUserRoles(userId);
  }

  async me(id: number) {
    const user = await this.userRepository.me(id);

    // Map and return UserDto instance
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
