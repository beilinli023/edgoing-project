import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { HttpModule } from '@nestjs/axios'; // 导入 HttpModule 用于发起 HTTP 请求

@Module({
  imports: [
    HttpModule, // 注册 HttpModule
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService], // 只导出BlogService，控制器不能被导出
})
export class BlogModule {}
