import { Module } from '@nestjs/common';
import { DispatchController } from './controllers/dispatch.controller';
import { AiMatchingService } from './services/ai-matching.service';
import { QueueService } from './services/queue.service';
import { DispatchGateway } from './gateways/dispatch.gateway';

@Module({
  controllers: [DispatchController],
  providers: [AiMatchingService, QueueService, DispatchGateway],
})
export class DispatchModule {}
