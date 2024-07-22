import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChurchServiceService } from './church-service.service';
import { ChurchServiceDto, ChurchServicePaginationDto } from './dtos';

@Controller()
export class ChurchServiceController {
  constructor(private readonly churchServiceService: ChurchServiceService) {}

  @Get('api/v1/church-service')
  async findAll(@Query() query: ChurchServicePaginationDto) {
    return await this.churchServiceService.findAll(query.page, query.limit);
  }

  @Get('api/v1/church-service/:id')
  async findById(@Param('id') id: number) {
    return await this.churchServiceService.findById(id);
  }

  @Post('api/v1/church-service')
  async create(@Body() data: ChurchServiceDto) {
    return await this.churchServiceService.create(data);
  }

  @Patch('api/v1/church-service/:id')
  async update(
    @Param('id') id: number,
    @Body() data: Partial<ChurchServiceDto>,
  ) {
    return await this.churchServiceService.update(id, data);
  }

  @Delete('api/v1/church-service/:id')
  async delete(@Param('id') id: number) {
    return await this.churchServiceService.delete(id);
  }
}
