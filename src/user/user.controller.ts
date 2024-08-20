import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import FirebaseService from 'src/firebase/firebase.service';
import { S3Service } from 'src/aws/s3/s3.service';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('api/v1/users')
  async findUsersByChurchId(@Req() req: Request) {
    const user = req.user;
    const users = await this.userService.findUsersByChurchId(user.churchId);

    return {
      status: 'success',
      data: users,
    };
  }
}
