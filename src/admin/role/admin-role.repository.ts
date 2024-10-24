import { Injectable } from "@nestjs/common";
import RepositoryError from "src/common/errors/repository-error";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class AdminRoleRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly repositoryError: RepositoryError,
    ) {}

    async findAll() {
        try {
            const result = await this.prisma.role.findMany()
            return result
        } catch (error) {
            this.repositoryError.handleError(error)
        }
    }
}