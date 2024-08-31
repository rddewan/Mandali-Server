import { Controller, Get, Req } from '@nestjs/common';
import { ChurchSettingService } from './church-setting.service';
import { Request } from 'express';

@Controller()
export class ChurchSettingController {
  constructor(private readonly service: ChurchSettingService) {}

  @Get('api/v1/church-setting')
  async findById(@Req() res: Request) {
    const user = res.user;

    const result = await this.service.findById(user.churchId);

    return {
      status: 'success',
      data: result,
    };
  }
}
