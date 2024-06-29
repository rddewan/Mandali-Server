import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/common/dtos/user.dto';
import { AuthDto } from './dtos';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
