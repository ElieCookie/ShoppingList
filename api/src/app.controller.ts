import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private dataSource: DataSource) {}

  @Get('livez')
  live() {
    return { status: 'alive' };
  }

  @Get('readyz')
  async ready() {
    if (!this.dataSource.isInitialized) throw new ServiceUnavailableException();
    return { status: 'ready' };
  }
}
