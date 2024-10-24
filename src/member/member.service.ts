import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { S3Service } from 'src/aws/s3/s3.service';
import { RoleType } from '@prisma/client';
import { RedisCacheService } from 'src/cache/redis-cache.service';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly s3Service: S3Service,    
    private readonly redisCacheService: RedisCacheService
  ) {}

  async findMemberById(id: number, churchId: number) {
    // get catch data
    const cacheData = await this.redisCacheService.get(`church-${churchId}-member-${id}`);
    // if cache data exists, return it
    if (cacheData) {
      return cacheData;
    }
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

    const data = {
      id: member.id,
      name: member.name,
      email: member.email,
      phoneNumber: member.phoneNumber,
      photo,
      role: roles.map((role) => ({
        id: role.role.id,
        name: role.role.name,
      })),
      guild: member.guilds.map((data) => ({
        id: data.guild.id,
        name: data.guild.name,
      })),
    };

    await this.redisCacheService.set(`church-${churchId}-member-${id}`, data);

    return data;
  }

  async findMembersByChurchId(churchId: number) {
    // get catch data
    const cacheData = await this.redisCacheService.get(`church-${churchId}-members`);    
    
    // if cache data exists, return it
    if (cacheData) {
      return cacheData;
    }

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
        guild: member.guilds.map((data) => ({
          id: data.guild.id,
          name: data.guild.name,
        })),
      };
    });

    // Wait for all promises to resolve and return the final result
    const data = await Promise.all(membersPromises);
    // Set the result in the cache
    await this.redisCacheService.set(`church-${churchId}-members`, data);

    return data;
  }
}
