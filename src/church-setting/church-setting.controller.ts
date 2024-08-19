import { Controller, Get, Res } from '@nestjs/common';
import { ChurchSettingService } from './church-setting.service';
import { Request } from 'express';

@Controller()
export class ChurchSettingController {
  constructor(private readonly service: ChurchSettingService) {}

  @Get('api/v1/church-setting')
  async findById(@Res() res: Request) {
    const user = res.user;
    return await this.service.findById(user.churchId);
  }
}
