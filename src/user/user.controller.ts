import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request } from 'express';
import FirebaseService from 'src/firebase/firebase.service';
import { UpdateUserDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/aws/s3/s3.service';
import { ProfilePhotoPipe } from 'src/common/pipe/profile-photo.pipe';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private firebaseService: FirebaseService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('api/v1/users/me/profile-photo')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePhoto(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
      ProfilePhotoPipe,
    )
    file: Express.Multer.File,
    @Req() req: Request,
  ) {
    try {
      const user = req.user;
      // create a file name
      const fileName = `user-${user.id}.jpeg`;
      // upload image to s3
      await this.s3Service.uploadObject(fileName, file.buffer, file.mimetype);
      // update user photo in database
      await this.userService.updateMe(user.id, {
        name: user.name,
        photo: fileName,
      });

      // get signed url from s3 - that will expires in 7 days ( 60 * 60 * 24 * 7)
      const url = await this.s3Service.getSignedUrl(fileName, 60);

      return {
        status: 'success',
        data: url,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('api/v1/users/me/profile-photo')
  async getProfilePhoto(@Req() req: Request) {
    try {
      const user = req.user;
      // create a file name
      const fileName = user.photo;

      // get signed url from s3 - that will expires in 7 days ( 60 * 60 * 24 * 7)
      const url = await this.s3Service.getSignedUrl(fileName, 60);

      return {
        status: 'success',
        data: url,
      };
    } catch (error) {
      throw error;
    }
  }

  @Get('api/v1/users/me/roles')
  async getMyRoles(@Req() req: Request) {
    const user = req.user;
    const result = await this.userService.getUserRoles(user.id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Get('api/v1/users/me')
  async me(@Req() req: Request) {
    const user = req.user;
    const result = await this.userService.me(user.id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Patch('api/v1/users/me')
  async updateMe(@Req() req: Request, @Body() data: UpdateUserDto) {
    const user = req.user;
    await this.userService.updateMe(user.id, data);
    const result = await this.userService.me(user.id);

    return {
      status: 'success',
      data: result,
    };
  }

  @Delete('api/v1/users/me')
  async deleteMe(@Req() req: Request) {
    const user = req.user;

    // create a file name
    const fileName = `user-${user.id}.jpeg`;

    // delete user from DB
    await this.userService.deleteMe(user.id);
    // delete user from firebase
    if (user.firebaseUID) {
      await this.firebaseService.deleteUser(user.firebaseUID);
    }
    // delete image from s3
    if (user.photo === fileName) {
      await this.s3Service.deleteObject(user.photo);
    }

    return {
      status: 'success',
      data: null,
    };
  }
}
