import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ChurchDto } from './dtos';
import { ChurchService } from './church.service';
import { PublicRoute } from 'src/common/decorators';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
export class ChurchController {
  constructor(private readonly churchService: ChurchService) {}

  @Post('/api/v1/church')
  async createChurch(@Body() data: Partial<ChurchDto>) {
    const result = await this.churchService.createChurch(data);

    return {
      status: 'success',
      data: result,
    };
  }

  @PublicRoute()
  @Get('/api/v1/church')
  async findAll() {
    const result = await this.churchService.findAll();

    return {
      status: 'success',
      data: result,
    };
  }

  @PublicRoute()
  @Get('/api/v1/church/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.churchService.findChurchById(id);

    return {
      status: 'success',
      data: result,
    };
  }
}
