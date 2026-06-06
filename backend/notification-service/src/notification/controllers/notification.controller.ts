import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from '../services/push.service';
import { SmsService } from '../services/sms.service';

@Controller('notify')
export class NotificationController {
  constructor(
    private pushService: PushService,
    private smsService: SmsService
  ) {}

  @Post('push')
  sendPushNotification(@Body() payload: { userId: string; title: string; body: string }) {
    return this.pushService.sendPush(payload.userId, payload.title, payload.body);
  }

  @Post('sms')
  sendSms(@Body() payload: { phone: string; message: string }) {
    return this.smsService.sendSms(payload.phone, payload.message);
  }
}
