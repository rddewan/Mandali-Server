import { Module } from '@nestjs/common';
import { ChurchSettingRepository } from './church-setting.repository';
import { ChurchSettingService } from './church-setting.service';
import RepositoryError from 'src/common/errors/repository-error';
import { ChurchSettingController } from './church-setting.controller';

@Module({
  controllers: [ChurchSettingController],
  providers: [ChurchSettingRepository, ChurchSettingService, RepositoryError],
})
export class ChurchSettingModule {}
