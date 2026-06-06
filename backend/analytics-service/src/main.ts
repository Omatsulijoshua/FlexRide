import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // HTTP Port 3011 for Analytics Service (Frontend hits this via Gateway)
  await app.listen(3011);
  console.log('Analytics Engine is running on port 3011');
}
bootstrap();
