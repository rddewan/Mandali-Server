import { Module } from '@nestjs/common';
import { ChurchServiceController } from 'src/church-service/church-service.controller';
import { ChurchSettingRepository } from './church-setting.repository';
import { ChurchSettingService } from './church-setting.service';
import RepositoryError from 'src/common/errors/repository-error';

@Module({
  controllers: [ChurchServiceController],
  providers: [ChurchSettingRepository, ChurchSettingService, RepositoryError],
})
export class ChurchSettingModule {}
