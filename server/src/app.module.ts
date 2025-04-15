import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BlogModule } from './modules/blog/blog.module';
import { BlogCompatModule } from './modules/blog-compat/blog-compat.module';
import { HealthModule } from './modules/health/health.module';
import { FaqModule } from './modules/faq/faq.module';
import * as path from 'path'; // 导入 path 模块

// 计算 .env 文件的绝对路径 (假设 server 目录在项目根目录下)
const envFilePath = path.resolve(__dirname, '..', '.env'); 
// 如果 server 目录嵌套更深，需要调整 '..' 的数量

@Module({
  imports: [
    // 加载环境变量，设置为全局，并明确指定 .env 文件路径
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath, // <-- 明确指定路径
    }),
    // 注册HTTP模块以便在各个服务中使用
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
    // 注册博客模块
    BlogModule,
    // 注册博客兼容模块，提供旧API路径支持
    BlogCompatModule,
    // 注册健康检查模块
    HealthModule,
    // 注册FAQ模块
    FaqModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
