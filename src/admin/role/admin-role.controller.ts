import { Controller, Get, UseGuards } from "@nestjs/common";
import { RoleGuard } from "src/guards/role.guard";
import { AdminRoleService } from "./admin-role.service";
import { Roles } from "src/common/decorators";
import { RoleType } from "@prisma/client";



@Controller()
@UseGuards(RoleGuard)
export class AdminRoleController {

    constructor(
        private readonly adminRoleService: AdminRoleService
    ) {}

    @Get('api/v1/admin/roles')
    @Roles(RoleType.admin, RoleType.superAdmin)
    async findAll() {
        const result =  await this.adminRoleService.findAll();

        return {
            status: 'success',
            data: result
        }
    }

}