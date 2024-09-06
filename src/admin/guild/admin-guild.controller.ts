import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { RoleGuard } from "src/guards/role.guard";
import { AdminGuildService } from "./admin-guild.service";
import { Roles } from "src/common/decorators";
import { RoleType } from "@prisma/client";



@Controller()
@UseGuards(RoleGuard)
export class AdminGuildController {
    constructor(
        private readonly guildService: AdminGuildService
    ) {}

    @Get('api/v1/admin/guilds/:id')
    @Roles(RoleType.admin, RoleType.superAdmin)
    async findById(@Param('id', ParseIntPipe) id: number) {
        const result = await this.guildService.findById(id);

        return {
            status: 'success',
            data: result,
        }

    }

    @Get('api/v1/admin/guilds')
    @Roles(RoleType.admin, RoleType.superAdmin)
    async findAll() {
        const result = await this.guildService.findAll();

        return {
            status: 'success',
            data: result,
        }

    }
}