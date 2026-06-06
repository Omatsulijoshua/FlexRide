import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // This service exposes WebSockets rather than a standard REST/TCP microservice port
  // Although it can do both, for Phase 8 we focus on the WSS gateway on port 3005
  await app.listen(3005);
  console.log('Realtime Tracking Service (WebSockets) is running on port 3005');
}
bootstrap();
