import { Controller, Get, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { GuildService } from "./guild.service";




@Controller()
export class GuildController {
    constructor(
        private readonly guildService: GuildService
    ) {}

    @Get('api/v1/guilds/:id')
    async findById(@Param('id', ParseIntPipe) id: number) {
        const result = await this.guildService.findById(id);

        return {
            status: 'success',
            data: result,
        }

    }

    @Get('api/v1/guilds')
    async findAll() {
        const result = await this.guildService.findAll();

        return {
            status: 'success',
            data: result,
        }

    }
}