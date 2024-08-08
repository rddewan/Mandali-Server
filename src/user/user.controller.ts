import { Body, Controller, Delete, Get, Patch, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import FirebaseService from 'src/firebase/firebase.service';
import { UpdateUserDto } from './dtos';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
  ) {}

  @Get('api/v1/users/me/roles')
  async getMyRoles(@Req() req: Request) {
    const user = req.user;
    const result = await this.userService.getUserRoles(user.id);

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

  @Patch('api/v1/users/me')
  async updateMe(@Req() req: Request, @Body() data: UpdateUserDto) {
    const user = req.user;
    await this.userService.updateMe(user.id, data);
    const result = await this.userService.me(user.id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('api/v1/users/me')
  async deleteMe(@Req() req: Request) {
    const user = req.user;
    await this.userService.deleteMe(user.id);
    await this.firebaseService.deleteUser(user.firebaseUID);

    return {
      status: 'success',
      data: null,
    };
  }
}
