import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { S3Service } from 'src/aws/s3/s3.service';

@Injectable()
export class MemberService {
  constructor(
    private memberRepository: MemberRepository,
    private readonly s3Service: S3Service,
  ) {}

  async findUsersByChurchId(churchId: number) {
    // Fetch users associated with the given church ID
    const users = await this.memberRepository.findUsersByChurchId(churchId);

    // Map through the users and construct the desired response
    const userPromises = users.map(async (user) => {
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
    return Promise.all(userPromises);
  }
}
