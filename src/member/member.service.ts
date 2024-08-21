import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { S3Service } from 'src/aws/s3/s3.service';

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

    return {
      id: member.id,
      name: member.name,
      email: member.email,
      phoneNumber: member.phoneNumber,
      photo,
      role: member.roles.map((userRole) => ({
        id: userRole.role.id,
        name: userRole.role.name,
      })),
    };
  }

  async findMembersByChurchId(churchId: number) {
    // Fetch members associated with the given church ID
    const members = await this.memberRepository.findMembersByChurchId(churchId);

    // Map through the users and construct the desired response
    const membersPromises = members.map(async (user) => {
      // Get the signed URL for the user's photo if it exists
      const photo = user.photo
        ? await this.s3Service.getSignedUrl(user.photo, 3600)
        : null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        photo,
        role: user.roles.map((userRole) => ({
          id: userRole.role.id,
          name: userRole.role.name,
        })),
      };
    });

    // Wait for all promises to resolve and return the final result
    return Promise.all(membersPromises);
  }
}