import { Module } from '@nestjs/common';
import RepositoryError from 'src/common/errors/repository-error';
import { ChurchServiceService } from './church-service.service';
import { ChurchServiceController } from './church-service.controller';
import { ChurchServiceRepository } from './church-service.repository';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  controllers: [ChurchServiceController],
  providers: [RepositoryError, ChurchServiceService, ChurchServiceRepository],
  imports: [FirebaseModule],
})
export class ChurchServiceModule {}
