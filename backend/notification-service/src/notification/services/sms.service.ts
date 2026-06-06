import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
  sendSms(phone: string, message: string) {
    // In production, this integrates with Twilio or Africa's Talking
    console.log(`[SMS -> ${phone}]: ${message}`);
    return { success: true, method: 'TWILIO' };
  }
}
