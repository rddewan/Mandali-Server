import {
  DeleteObjectCommand,
  GetObjectCommand,
  GetObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: ConfigService,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('S3_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_BUCKET_KEY'),
        secretAccessKey: this.configService.get<string>('S3_BUCKET_SECRET_KEY'),
      },
    });
  }

  async uploadObject(
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<void> {
    try {
      // create params
      const params: PutObjectCommandInput = {
        Bucket: this.configService.get<string>('S3_BUCKET_NAME') || '',
        Key: key,
        Body: body,
        ContentType: contentType,
      };
      // create command
      const command = new PutObjectCommand(params);
      // send the object to s3
      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteObject(key: string): Promise<void> {
    try {
      // set bucket
      const bucket = this.configService.get<string>('S3_BUCKET_NAME') || '';
      // delete object
      await this.s3Client.send(
        new DeleteObjectCommand({ Bucket: bucket, Key: key }),
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getSignedUrl(
    key: string,
    expiresIn: number,
  ): Promise<string | undefined> {
    try {
      // create params
      const params: GetObjectCommandInput = {
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key,
      };
      // create command
      const command = new GetObjectCommand(params);
      // generate signed url - that will expires in [expiresIn]
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresIn,
      });
      return url;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
