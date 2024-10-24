import { Injectable } from "@nestjs/common";
import { AdminRoleRepository } from "./admin-role.repository";


@Injectable()
export class AdminRoleService {
    constructor(
        private readonly adminRoleRepository: AdminRoleRepository,
    ) {}

    async findAll() {
        return await this.adminRoleRepository.findAll();
    }

}