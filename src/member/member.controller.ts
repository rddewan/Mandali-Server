import { Controller, Get, Req } from '@nestjs/common';
import { MemberService } from './member.service';
import { Request } from 'express';
import FirebaseService from 'src/firebase/firebase.service';
import { S3Service } from 'src/aws/s3/s3.service';

@Controller()
export class MemberController {
  constructor(
    private memberService: MemberService,
    private firebaseService: FirebaseService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('api/v1/members')
  async findUsersByChurchId(@Req() req: Request) {
    const user = req.user;
    const users = await this.memberService.findUsersByChurchId(user.churchId);

    return {
      status: 'success',
      data: users,
    };
  }
}
