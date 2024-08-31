import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { MeRepository } from './me.repository';
import { MeService } from './me.service';
import RepositoryError from 'src/common/errors/repository-error';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { S3Module } from 'src/aws/s3/s3.module';

@Module({
  controllers: [MeController],
  providers: [MeRepository, MeService, RepositoryError],
  imports: [FirebaseModule, S3Module],
})
export class MeModule {}
