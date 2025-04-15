import { Module } from '@nestjs/common';
import { BlogModule } from '../blog/blog.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { BlogCompatController } from './blog-compat.controller';

@Module({
  imports: [
    BlogModule,
    HttpModule,
    ConfigModule
  ],
  controllers: [BlogCompatController],
})
export class BlogCompatModule {} 