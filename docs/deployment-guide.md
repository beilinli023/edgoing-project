# 部署与监控指南

本文档详细说明了CMS系统的部署配置、监控策略和运维指南。

## 部署配置

### Docker Compose配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
      - DB_PORT=5432
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 健康检查配置

### 健康检查接口
```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

## 监控配置

### 日志配置
```typescript
// src/config/logging.config.ts
import * as winston from 'winston';

export const loggingConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
};
```

### Prometheus监控
```typescript
// src/monitoring/prometheus.config.ts
import { PrometheusOptions } from '@willsoto/nestjs-prometheus';

export const prometheusConfig: PrometheusOptions = {
  path: '/metrics',
  defaultMetrics: {
    enabled: true,
  },
  defaultLabels: {
    app: 'cms-api',
  },
};

// 自定义指标
export const customMetrics = {
  contentCreationDuration: new Histogram({
    name: 'content_creation_duration_seconds',
    help: '创建内容所需时间',
    labelNames: ['content_type'],
  }),
  activeUsers: new Gauge({
    name: 'active_users',
    help: '当前活跃用户数',
  }),
};
```

## CI/CD配置

### GitHub Actions配置
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          echo "${DOCKER_PASSWORD}" | docker login -u "${DOCKER_USERNAME}" --password-stdin
          docker-compose -f docker-compose.prod.yml build
          docker-compose -f docker-compose.prod.yml push
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
```
