import { Module } from '@nestjs/common';
import { ChurchController } from './church.controller';
import RepositoryError from 'src/common/errors/repository-error';
import { ChurchRepository } from './church.repository';
import { ChurchService } from './church.service';

@Module({
  controllers: [ChurchController],
  providers: [RepositoryError, ChurchRepository, ChurchService],
  exports: [ChurchService],
})
export class ChurchModule {}
