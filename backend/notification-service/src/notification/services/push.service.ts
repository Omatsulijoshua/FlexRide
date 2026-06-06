import { Injectable } from '@nestjs/common';

@Injectable()
export class PushService {
  sendPush(userId: string, title: string, body: string) {
    // In production, this integrates with Firebase Admin SDK (FCM)
    console.log(`[PUSH -> User ${userId}]: ${title} - ${body}`);
    return { success: true, method: 'FCM' };
  }
}
