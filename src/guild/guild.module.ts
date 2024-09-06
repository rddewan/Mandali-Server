import { Module } from "@nestjs/common";
import { GuildController } from "./guild.controller";
import { GuildRepository} from "./guild.repository";
import { GuildService } from "./guild.service";
import RepositoryError from "src/common/errors/repository-error";



@Module({
    imports: [],
    controllers: [GuildController],
    providers: [GuildRepository, GuildService, RepositoryError],
})
export class GuildModel {
}