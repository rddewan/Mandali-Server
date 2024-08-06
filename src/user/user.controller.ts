import { Controller, Delete, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}

  @Get('api/v1/users/:id/roles')
  getUserRoles() {
    const result = this.userService.getUserRoles(1);

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('api/v1/users/my-roles')
  getMyRoles(@Req() req: Request) {
    const user = req.user;
    const result = this.userService.getUserRoles(user.id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('api/v1/users/me')
  async me(@Req() req: Request) {
    const user = req.user;
    const result = await this.userService.me(user.id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('api/v1/users/delete-me')
  async deleteMe(@Req() req: Request) {
    const user = req.user;
    await this.userService.deleteMe(user.id);

    return {
      status: 'success',
      data: null,
    };
  }
}
