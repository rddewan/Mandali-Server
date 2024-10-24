import { Module } from "@nestjs/common";
import { AdminRoleController } from "./admin-role.controller";
import { AdminRoleRepository } from "./admin-role.repository";
import { AdminRoleService } from "./admin-role.service";
import RepositoryError from "src/common/errors/repository-error";


@Module({
    controllers: [AdminRoleController],
    providers: [
        AdminRoleRepository,
        AdminRoleService,
        RepositoryError,
    ],
})
export class AdminRoleModule { }