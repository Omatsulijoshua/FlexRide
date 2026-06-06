import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // TCP Port for internal microservice communication (Push Triggers)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '127.0.0.1',
      port: 3009,
    },
  });

  await app.startAllMicroservices();
  
  // HTTP/WebSocket Port for Chat Connections
  await app.listen(3010);
  console.log('Notification Service (TCP: 3009, WSS: 3010) is running');
}
bootstrap();
