import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.use(cookieParser());
  // Use the compression middleware package to enable gzip compression.
  app.use(compression());

  const config = app.get(ConfigService);
  const PORT = config.get<number>('PORT') || 3000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`mandali api is running on: ${PORT}`);
}
bootstrap();
