import { Injectable } from '@nestjs/common';
import { ChurchSettingRepository } from './church-setting.repository';

@Injectable()
export class ChurchSettingService {
  constructor(private readonly repository: ChurchSettingRepository) {}

  async findById(id: number) {
    return await this.repository.findById(id);
  }
}
