import { Module } from '@nestjs/common';
import { NotificationController } from './controllers/notification.controller';
import { ChatGateway } from './gateways/chat.gateway';
import { PushService } from './services/push.service';
import { SmsService } from './services/sms.service';

@Module({
  controllers: [NotificationController],
  providers: [ChatGateway, PushService, SmsService],
})
export class NotificationModule {}
