import { Injectable } from '@nestjs/common';
import { log } from 'console';
import RepositoryError from 'src/common/errors/repository-error';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly repositoryError: RepositoryError,
  ) {}

  async setUserRole(userId: number, roleId: number) {
    try {
      // Check if the user already has this role
      const existingRole = await this.prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });

      if (!existingRole) {
        // Add the role if it does not exist
        await this.prisma.userRole.create({
          data: {
            userId,
            roleId,
          },
        });
      }

      return await this.findUserById(userId);
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async deleteUserRole(userId: number, roleId: number) {
    try {
      await this.prisma.userRole.delete({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async setUserGuild(userId: number, guildId: number) {
    try {
      // Check if the user already has this guild
      const existingGuild = await this.prisma.userGuild.findUnique({
        where: {
          userId_guildId: {
            userId,
            guildId,
          }
        },
      })

      if (!existingGuild) {
        // Add the guild if it does not exist
        await this.prisma.userGuild.create({
          data: {
            userId,
            guildId
          }
        })
      }

      return await this.findUserById(userId);
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async deleteUserGuild(userId: number, guildId: number) {
    try {
      await this.prisma.userGuild.delete({
        where: {
          userId_guildId: {
            userId,
            guildId
          }
        }
      })
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findUserByChurch(churchId: number) {
    try {
      return await this.prisma.user.findMany({
        where: {
          churchId,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async findUserById(userId: number) {
    try {
      return await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          phoneNumber: true,
          email: true,
          photo: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          guilds: {
            select: {
              guild: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          church: {
            select: {
              id: true,
              name: true,
              churchSetting: {
                select: {
                  timeZone: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }

  async deleteUserById(userId: number) {
    try {
      await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      this.repositoryError.handleError(error);
    }
  }
}
