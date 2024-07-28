import { ForbiddenException, Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/common/dtos/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload, Token } from './types';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import TokenExpiredException from 'src/common/exceptions/token-expired-exception';
import FirebaseService from 'src/firebase/firebase.service';
import { AuthType } from '@prisma/client';
import {
  AuthDto,
  FirebaseLoginDto,
  LoginDto,
  PhoneAuthDto,
  RefreshTokenDto,
} from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private authRepository: AuthRepository,
    private prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly firebaseService: FirebaseService,
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

  async loginWithFirebaseToken(dto: FirebaseLoginDto): Promise<Token> {
    // verify the token
    const decodedToken = await this.firebaseService.verifyIdToken(dto.token);
    // fetch the user from the firebase using the decoded token
    const firebaseUser = await this.firebaseService.getUser(decodedToken.uid);

    const user = await this.authRepository.findUserByPhoneNumber(
      firebaseUser.phoneNumber,
      firebaseUser.email,
    );

    // if no user, create a new user
    if (!user) {
      const data: PhoneAuthDto = {
        name: firebaseUser.displayName || firebaseUser.phoneNumber,
        email: firebaseUser.email || firebaseUser.phoneNumber,
        phoneNumber: firebaseUser.phoneNumber,
        authType: firebaseUser.phoneNumber ? AuthType.phone : AuthType.social,
        churchId: dto.churchId,
      };

      const newUser = await this.authRepository.createPhoneAuthUser(data);
      const token = await this.createToken(newUser.id);

      return token;

      // if user exists, create a new token
    } else {
      const token = await this.createToken(user.id);

      return token;
    }
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

  async emailExists(email: string) {
    const user = await this.authRepository.findUserByEmail(email);
    return !!user;
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
      expiresIn: '10m',
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
