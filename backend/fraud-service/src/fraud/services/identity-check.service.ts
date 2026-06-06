import { Injectable } from '@nestjs/common';
import { UserRegisteredEventDto } from '../dto/user-registered-event.dto';

@Injectable()
export class IdentityCheckService {
  // Mock Redis store for device IDs
  private deviceMap = new Map<string, number>();

  async analyzeRegistration(event: UserRegisteredEventDto) {
    const { deviceId, ipAddress } = event;
    
    if (!deviceId) return { status: 'CLEARED' }; // E.g., Web signup without device ID

    const currentCount = this.deviceMap.get(deviceId) || 0;
    
    if (currentCount >= 3) {
      console.warn(`[FRAUD ALERT] Device ${deviceId} has created >3 accounts. Promo farming suspected.`);
      // Flag account for shadow-ban (cannot use promos)
      return { status: 'FLAGGED', reason: 'PROMO_FARMING_DEVICE' };
    }

    this.deviceMap.set(deviceId, currentCount + 1);
    return { status: 'CLEARED' };
  }
}
