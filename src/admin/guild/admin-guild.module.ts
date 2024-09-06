import { Module } from "@nestjs/common";
import { AdminGuildController } from "./admin-guild.controller";
import { AdminGuildRepository} from "./admin-guild.repository";
import { AdminGuildService } from "./admin-guild.service";
import RepositoryError from "src/common/errors/repository-error";



@Module({
    imports: [],
    controllers: [AdminGuildController],
    providers: [AdminGuildRepository, AdminGuildService, RepositoryError],
})
export class AdminGuildModel {
}