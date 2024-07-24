import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/common/dtos/user.dto';
import { AuthDto, FirebaseLoginDto, LoginDto, RefreshTokenDto } from './dtos';
import { CookieOptions, Response } from 'express-serve-static-core';
import { ConfigService } from '@nestjs/config';
import { PublicRoute } from 'src/common/decorators';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @PublicRoute()
  @Post('api/v1/auth/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() data: AuthDto,
  ): Promise<{ status: string; data: UserDto }> {
    const result = await this.authService.signup(data);
    return {
      status: 'success',
      data: result,
    };
  }

  @PublicRoute()
  @Post('api/v1/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // get token
    const token = await this.authService.login(data);
    // one minute = 60 * 1000
    const oneMinute = 60 * 1000;
    // one hour = 60 * 60 * 1000
    const oneHour = oneMinute * 60;
    // one day = 24 * 60 * 60 * 1000
    const oneDay = 24 * oneHour;
    // cookies options
    const isSecure =
      this.configService.get<string>('COOKIES_SECURE') === 'true';
    // access token cookies options
    const accessTokenCookiesOption: CookieOptions = {
      expires: new Date(Date.now() + oneMinute * 5),
      httpOnly: true,
      secure: isSecure,
      sameSite: 'none',
    };

    // refresh token cookies options
    const refreshTokenCookiesOption: CookieOptions = {
      expires: new Date(Date.now() + oneDay * 7),
      httpOnly: true,
      secure: isSecure,
      sameSite: 'none',
    };
    // set cookies for access token
    res.cookie('access_token', token.access_token, accessTokenCookiesOption);
    // set cookies for refresh token
    res.cookie('refresh_token', token.refresh_token, refreshTokenCookiesOption);

    return {
      status: 'success',
      data: token,
    };
  }

  @PublicRoute()
  @Post('api/v1/auth/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() data: RefreshTokenDto) {
    const result = await this.authService.refresh(data);

    return {
      status: 'success',
      data: result,
    };
  }

  @PublicRoute()
  @Post('api/v1/auth/login-with-firebase-token')
  @HttpCode(HttpStatus.OK)
  async loginWithFirebaseToken(@Body() data: FirebaseLoginDto) {
    const result = await this.authService.loginWithFirebaseToken(data);

    return {
      status: 'success',
      data: result,
    };
  }

  @PublicRoute()
  @Post('api/v1/auth/email-exists')
  @HttpCode(HttpStatus.OK)
  async emailExists(@Body() data: { email: string }) {
    const result = await this.authService.emailExists(data.email);
    return {
      status: 'success',
      data: result,
    };
  }
}
