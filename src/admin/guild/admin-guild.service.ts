import { Injectable } from "@nestjs/common";
import { AdminGuildRepository } from "./admin-guild.repository";



@Injectable()
export class AdminGuildService {
    constructor(
        private readonly guildRepository: AdminGuildRepository
    ) {}

    async findById(id: number) {
        return await this.guildRepository.findById(id);
    }

    async findAll() {
        return await this.guildRepository.findAll();
    }
}