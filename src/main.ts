import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS if needed
  app.setGlobalPrefix('api'); // Set global API prefix if desired

  const port = process.env.PORT || 3001; // Read from .env or default to 3001
  await app.listen(port);
  Logger.log(`🚀 Backend server running on port ${port}`, 'Bootstrap');
}
bootstrap();