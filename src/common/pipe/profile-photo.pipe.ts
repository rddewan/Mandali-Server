import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ProfilePhotoPipe implements PipeTransform {
  async transform(image: Express.Multer.File): Promise<Express.Multer.File> {
    // check if image is valid
    if (!image) {
      throw new BadRequestException('File is required');
    }

    try {
      // Resize and compress the image using sharp
      const processedBuffer = await sharp(image.buffer)
        .resize({ width: 400, height: 400, fit: 'inside' })
        .toFormat('jpeg')
        .jpeg({ quality: 75 })
        .toBuffer();

      // Replace the file buffer with the processed buffer
      image.buffer = processedBuffer;
      return image;
    } catch (error) {
      throw new BadRequestException('Error processing image');
    }
  }
}
