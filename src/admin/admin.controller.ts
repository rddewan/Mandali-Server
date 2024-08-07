import {
  Body,
  Controller,
  Delete,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { SetRoleDto } from './dtos';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/common/decorators';
import { RoleType } from '@prisma/client';

@Controller()
@UseGuards(RoleGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('api/v1/admin/set-user-role')
  @Roles(RoleType.admin, RoleType.superAdmin)
  async setUserRole(@Body() body: SetRoleDto) {
    const result = await this.adminService.setUserRole(
      body.userId,
      body.roleId,
    );

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('api/v1/admin/delete-user-role')
  @Roles('admin', 'superAdmin')
  async deleteUserRole(
    @Query('roleId', ParseIntPipe) roleId: number,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    await this.adminService.deleteUserRole(userId, roleId);

    return {
      status: 'success',
      data: null,
    };
  }
}
