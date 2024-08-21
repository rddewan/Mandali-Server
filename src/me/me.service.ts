import { Injectable } from '@nestjs/common';
import { MeRepository } from './me.repository';
import { UpdateUserDto } from './dtos';
import { S3Service } from 'src/aws/s3/s3.service';
import { RoleType } from '@prisma/client';

@Injectable()
export class MeService {
  constructor(
    private readonly meRepository: MeRepository,
    private readonly s3Service: S3Service,
  ) {}

  async getUserRoles(userId: number) {
    return await this.meRepository.getUserRoles(userId);
  }

  async me(id: number) {
    const user = await this.meRepository.me(id);
    // Get the signed URL for the user's photo if it exists
    const photo = user.photo
      ? await this.s3Service.getSignedUrl(user.photo, 3600)
      : null;

    // Check if the user has a 'member' role
    const hasMemberRole = user.roles.some(
      (role) => role.role.name === RoleType.member,
    );

    // Filter out the 'user' role if the user also has a 'member' role
    const roles = hasMemberRole
      ? user.roles.filter((role) => role.role.name !== RoleType.user)
      : user.roles;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photo,
      role: roles.map((role) => ({
        id: role.role.id,
        name: role.role.name,
      })),
      church: {
        id: user.church.id,
        name: user.church.name,
        timeZone: user.church.churchSetting.timeZone,
      },
    };
  }

  async deleteMe(userId: number) {
    return this.meRepository.deleteMe(userId);
  }

  async updateMe(userId: number, data: UpdateUserDto) {
    return this.meRepository.updateMe(userId, data);
  }
}
