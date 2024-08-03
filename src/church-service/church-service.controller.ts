import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ChurchServiceService } from './church-service.service';
import { ChurchServiceDto, ChurchServicePaginationDto } from './dtos';
import { Request } from 'express';

@Controller()
export class ChurchServiceController {
  constructor(private readonly churchServiceService: ChurchServiceService) {}

  @Get('api/v1/church-service')
  async findAll(
    @Req() req: Request,
    @Query() query: ChurchServicePaginationDto,
  ) {
    const user = req.user;
    const result = await this.churchServiceService.findAll(
      query.page,
      query.limit,
      user.churchId,
    );

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('api/v1/church-service/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.churchServiceService.findById(id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Post('api/v1/church-service')
  async create(@Body() data: ChurchServiceDto) {
    const result = await this.churchServiceService.create(data);
    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('api/v1/church-service/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<ChurchServiceDto>,
  ) {
    const result = await this.churchServiceService.update(id, data);

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('api/v1/church-service/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    const result = await this.churchServiceService.delete(id);

    return {
      status: 'success',
      data: result,
    };
  }
}
