import { Injectable } from "@nestjs/common";
import RepositoryError from "src/common/errors/repository-error";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class AdminGuildRepository {
    constructor(
        private readonly prisma: PrismaService,
        private readonly repositoryError: RepositoryError,
    ) {}

    async findById(id: number) {
        try {
            const guild = await this.prisma.guild.findUnique({
                where: {
                    id
                }
            })
            return guild
            
        } catch (error) {
            throw this.repositoryError.handleError(error)
        }
    }

    async findAll() {
        try {
            return await this.prisma.guild.findMany();
        } catch (error) {
            throw this.repositoryError.handleError(error)
        }
    }
}