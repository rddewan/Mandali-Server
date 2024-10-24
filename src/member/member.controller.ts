import { Controller, Get, Param, ParseIntPipe, Req, UseInterceptors } from '@nestjs/common';
import { MemberService } from './member.service';
import { Request } from 'express';

@Controller()
export class MemberController {
  constructor(
    private memberService: MemberService,
  ) {}

  @Get('api/v1/members')
  async findUsersByChurchId(@Req() req: Request) {
    const user = req.user;
    const members = await this.memberService.findMembersByChurchId(
      user.churchId,
    );

    return {
      status: 'success',
      data: members,
    };
  }

  @Get('api/v1/members/:id')
  async findMemberById(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const user = req.user;
    const member = await this.memberService.findMemberById(id, user.churchId);

    return {
      status: 'success',
      data: member,
    };
  }
}
