import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { SetGuildDto, SetRoleDto } from './dtos';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/common/decorators';
import { RoleType } from '@prisma/client';
import { Request } from 'express';

@Controller()
@UseGuards(RoleGuard)
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Get('api/v1/admin/users')
  @Roles(RoleType.admin, RoleType.superAdmin)
  async getUsers(@Req() req: Request) {
    const user = req.user;
    const result = await this.adminUserService.findUserbyChurch(user.churchId);
    
    return {
      status: 'success',
      data: result,
    };
  }

  @Post('api/v1/admin/users/set-user-role')
  @Roles(RoleType.admin, RoleType.superAdmin)
  async setUserRole(@Body() body: SetRoleDto) {
    const result = await this.adminUserService.setUserRole(
      body.userId,
      body.roleId,
    );

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('api/v1/admin/user/delete-user-role')
  @Roles(RoleType.admin, RoleType.superAdmin)
  async deleteUserRole(
    @Query('roleId', ParseIntPipe) roleId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    await this.adminUserService.deleteUserRole(userId, roleId);

    return {
      status: 'success',
      data: null,
    };
  }

  @Post('api/v1/admin/users/set-user-guild')
  @Roles(RoleType.admin, RoleType.superAdmin)
  async setUserGuild(@Body() body: SetGuildDto) {

    const result = await this.adminUserService.setUserGuild(
      body.userId,
      body.guildId,
    );

    return {
      status: 'success',
      data: result,
    }
  }

  @Delete('api/v1/admin/users/delete-user-guild')
  @Roles(RoleType.admin, RoleType.superAdmin)
  async deleteUserGuild(
    @Query('guildId', ParseIntPipe) guildId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    await this.adminUserService.deleteUserGuild(userId, guildId);

    return {
      status: 'success',
      data: null,
    }
  }
}
