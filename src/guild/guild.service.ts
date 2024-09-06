import { Injectable } from "@nestjs/common";
import { GuildRepository } from "./guild.repository";



@Injectable()
export class GuildService {
    constructor(
        private readonly guildRepository: GuildRepository
    ) {}

    async findById(id: number) {
        return await this.guildRepository.findById(id);
    }

    async findAll() {
        return await this.guildRepository.findAll();
    }
}