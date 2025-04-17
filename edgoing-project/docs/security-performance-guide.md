# 安全与性能优化指南

本文档详细说明了CMS系统的安全配置和性能优化策略。

## 安全配置

### 基础安全中间件
```typescript
// src/config/security.config.ts
import { INestApplication } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';

export function configureSecurityMiddleware(app: INestApplication) {
  // 基本安全头
  app.use(helmet());

  // CSRF保护
  app.use(csurf());

  // 速率限制
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 每个IP限制100个请求
    }),
  );

  // 文件上传限制
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
}
```

## 缓存策略

### Redis缓存服务
```typescript
// src/services/cache.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  async get<T>(key: string): Promise<T | null> {
    const client = this.redisService.getClient();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const client = this.redisService.getClient();
    await client.set(
      key,
      JSON.stringify(value),
      'EX',
      ttl || 3600 // 默认1小时
    );
  }

  async del(key: string): Promise<void> {
    const client = this.redisService.getClient();
    await client.del(key);
  }
}
```

## 图片优化

### 图片处理服务
```typescript
// src/services/image.service.ts
import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
  async optimizeImage(buffer: Buffer, options: {
    width?: number;
    height?: number;
    quality?: number;
  }) {
    const { width, height, quality = 80 } = options;

    return sharp(buffer)
      .resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();
  }

  async generateThumbnail(buffer: Buffer) {
    return this.optimizeImage(buffer, {
      width: 200,
      height: 200,
      quality: 60,
    });
  }
}
```

## 数据库优化

### TypeORM配置
```typescript
// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: ['error'],
  maxQueryExecutionTime: 1000,
  cache: {
    type: 'redis',
    options: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
    },
    duration: 60000, // 1分钟
  },
};
```
