import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/common/dtos/user.dto';
import { AuthDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(private authRepository: AuthRepository) {}

  async signup(data: AuthDto) {
    const user = await this.authRepository.createUser(data);

    // Map and return UserDto instance
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
