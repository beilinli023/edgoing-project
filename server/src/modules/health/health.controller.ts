import { Controller, Get, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService, // Use HttpService from @nestjs/axios
  ) {}

  @Get()
  async check() {
    this.logger.log('Performing manual health check...');

    const strapiUrl = this.configService.get<string>('STRAPI_API_URL');
    const strapiToken = this.configService.get<string>('STRAPI_API_TOKEN');

    // 1. 检查关键配置是否存在
    if (!strapiUrl || !strapiToken) {
      this.logger.error('Critical configuration (Strapi URL or Token) is missing!');
      throw new ServiceUnavailableException('Configuration Error: Missing Strapi URL or Token');
    }

    // 2. 手动检查 Strapi 连接性 (ping)
    const strapiBaseUrl = strapiUrl.replace('/api', '');
    this.logger.debug(`Manually pinging Strapi at: ${strapiBaseUrl}`);

    try {
      // 使用 HEAD 请求，如果服务器支持的话，通常开销更小
      await firstValueFrom(
        this.httpService.head(strapiBaseUrl, { timeout: 2000 })
      );
      this.logger.log('Strapi connection check successful.');
      return { 
        status: 'ok', 
        info: { strapi_connection: { status: 'up' } },
        error: {}, // Mimic Terminus structure
        details: { strapi_connection: { status: 'up' } },
       };
    } catch (error) {
      // Log the entire error object for better debugging
      this.logger.error(`Health check failed: Unable to connect to Strapi at ${strapiBaseUrl}. Error details: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during Strapi connection check';

      // 抛出标准 NestJS 异常，框架会处理为 503
      throw new ServiceUnavailableException({
        status: 'error',
        error: { strapi_connection: { status: 'down', message: errorMessage } },
        details: { strapi_connection: { status: 'down', message: errorMessage } },
      });
    }
  }
} 