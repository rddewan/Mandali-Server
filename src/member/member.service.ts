import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { S3Service } from 'src/aws/s3/s3.service';
import { RoleType } from '@prisma/client';

@Injectable()
export class MemberService {
  constructor(
    private memberRepository: MemberRepository,
    private readonly s3Service: S3Service,
  ) {}

  async findMemberById(id: number) {
    // Fetch users associated with the given church ID
    const member = await this.memberRepository.findMembersById(id);
    // Get the signed URL for the user's photo if it exists
    const photo = member.photo
      ? await this.s3Service.getSignedUrl(member.photo, 3600)
      : null;

    // Check if the user has a 'member' role
    const hasMemberRole = member.roles.some(
      (role) => role.role.name === RoleType.member,
    );

    // Filter out the 'user' role if the user also has a 'member' role
    const roles = hasMemberRole
      ? member.roles.filter((role) => role.role.name !== RoleType.user)
      : member.roles;

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      phoneNumber: member.phoneNumber,
      photo,
      role: roles.map((role) => ({
        id: role.role.id,
        name: role.role.name,
      })),
    };
  }

  async findMembersByChurchId(churchId: number) {
    // Fetch members associated with the given church ID
    const members = await this.memberRepository.findMembersByChurchId(churchId);

    // Map through the users and construct the desired response
    const membersPromises = members.map(async (member) => {
      // Get the signed URL for the user's photo if it exists
      const photo = member.photo
        ? await this.s3Service.getSignedUrl(member.photo, 3600)
        : null;

      // Check if the user has a 'member' role
      const hasMemberRole = member.roles.some(
        (role) => role.role.name === RoleType.member,
      );

      // Filter out the 'user' role if the user also has a 'member' role
      const roles = hasMemberRole
        ? member.roles.filter((role) => role.role.name !== RoleType.user)
        : member.roles;

      return {
        id: member.id,
        name: member.name,
        email: member.email,
        phoneNumber: member.phoneNumber,
        photo,
        role: roles.map((role) => ({
          id: role.role.id,
          name: role.role.name,
        })),
      };
    });

    // Wait for all promises to resolve and return the final result
    return Promise.all(membersPromises);
  }
}
