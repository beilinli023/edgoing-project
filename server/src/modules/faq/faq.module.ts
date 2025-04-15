import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
// import { ConfigModule } from '@nestjs/config';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';

@Module({
  imports: [
    HttpModule,
    // ConfigModule,
  ],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {} 