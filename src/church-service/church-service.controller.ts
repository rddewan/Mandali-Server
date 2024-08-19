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
import FirebaseService from 'src/firebase/firebase.service';
import { format } from 'date-fns';

@Controller()
export class ChurchServiceController {
  constructor(
    private readonly churchServiceService: ChurchServiceService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('api/v1/church-service')
  async findAll(
    @Req() req: Request,
    @Query() query: ChurchServicePaginationDto,
  ) {
    const user = req.user;
    const result = await this.churchServiceService.findChurchServicesByChurchId(
      query.page,
      query.limit,
      user.churchId,
    );

    return {
      status: 'success',
      data: result.data,
      page: {
        currentPage: query.page,
        total: result.total,
        totalPage: Math.ceil(result.total / query.limit),
      },
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

    // send firebase notification
    const formattedDate = format(result.date, 'dd MMM yyyy');
    this.firebaseService.sendNotification(result.churchId.toString(), {
      notification: {
        title: 'New Church Service',
        body: `Church Service has been created for ${result.serviceType.toUpperCase()} on ${formattedDate}`,
      },
    });

    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('api/v1/church-service')
  async update(@Body() data: Partial<ChurchServiceDto>) {
    const result = await this.churchServiceService.update(data);

    // send firebase notification
    const formattedDate = format(result.date, 'dd MMM yyyy');
    this.firebaseService.sendNotification(result.churchId.toString(), {
      notification: {
        title: 'Church Service Updated',
        body: `Church Service has been updated for ${result.serviceType.toUpperCase()} on ${formattedDate}`,
      },
    });

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
