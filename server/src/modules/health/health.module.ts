import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';

@Module({
  imports: [
    HttpModule, // 提供 HttpService 给 HealthController
  ],
  controllers: [HealthController],
  providers: [], // No Terminus services needed
})
export class HealthModule {} 