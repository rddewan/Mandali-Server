import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/common/dtos/user.dto';
import { AuthDto, LoginDto, RefreshTokenDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { JwtPayload, Token } from './types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import TokenExpiredException from 'src/common/exceptions/token-expired-exception';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: AuthDto) {
    const user = await this.authRepository.createUser(data);

    // Map and return UserDto instance
    return plainToClass(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async login(data: LoginDto): Promise<Token> {
    const user = await this.authRepository.findUserByEmail(data.email);

    const isPasswordMatch = await this.comparePassword(
      data.password,
      user.passwordHash,
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException('Email or password is incorrect');
    }

    const token = await this.createToken(user.id);

    return token;
  }

  async refresh(data: RefreshTokenDto) {
    try {
      const refreshToken = data.refreshToken;
      // verify refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        },
      );

      // check if payload exists
      if (!payload) {
        throw new ForbiddenException('Access Denied');
      }

      // check if user exists
      const user = await this.authRepository.findUserById(payload.sub);
      // delete refresh token
      await this.authRepository.deleteRefreshToken(refreshToken);
      // create new token
      const token = await this.createToken(user.id);

      return token;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }

      throw error;
    }
  }

  private async comparePassword(data: string, hash: string) {
    return await bcrypt.compare(data, hash);
  }

  private async createToken(id: number): Promise<Token> {
    const payload: JwtPayload = { sub: id };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: '5m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: '1m',
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: id,
        token: refresh_token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const token: Token = {
      access_token: access_token,
      refresh_token: refresh_token,
    };

    return token;
  }
}
