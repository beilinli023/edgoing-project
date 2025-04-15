import 'reflect-metadata'; // 必须在顶部导入
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: {
        origin: true, // 允许所有来源访问，在生产环境中应该设置为特定域名
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      },
    });

    // 从配置服务获取端口
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PROXY_PORT') || 3001; // 默认3001

    // 设置全局 API 前缀为 'api'
    app.setGlobalPrefix('api');

    await app.listen(port);
    console.log(`Backend server running on http://localhost:${port}`);
  } catch (error) {
    console.error('启动NestJS应用时出错:', error);
  }
}
bootstrap();
