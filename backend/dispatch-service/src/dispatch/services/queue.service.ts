import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { DispatchRequestDto } from '../dto/dispatch-request.dto';
import { DispatchGateway } from '../gateways/dispatch.gateway';

@Injectable()
export class QueueService {
  private activeQueues = new Map<string, NodeJS.Timeout>();

  constructor(
    @Inject(forwardRef(() => DispatchGateway))
    private dispatchGateway: DispatchGateway
  ) {}

  startWaterfallPing(dispatchDto: any, orderedDriverIds: string[]) {
    let index = 0;

    const pingNext = () => {
      if (index >= orderedDriverIds.length) {
        console.log(`[Ride ${dispatchDto.rideId}] All drivers rejected or ignored. Ride goes to open pool.`);
        this.activeQueues.delete(dispatchDto.rideId);
        return;
      }

      const targetDriverId = orderedDriverIds[index];
      console.log(`[Ride ${dispatchDto.rideId}] Pinging driver ${targetDriverId}...`);
      
      // Emit WebSocket event to ALL connected drivers for this MVP demo
      this.dispatchGateway.broadcastNewRide(dispatchDto);
      
      // Wait 15 seconds for them to accept. If they don't, timeout triggers next driver.
      const timer = setTimeout(() => {
        console.log(`[Ride ${dispatchDto.rideId}] Driver ${targetDriverId} timed out.`);
        index++;
        pingNext();
      }, 15000);

      this.activeQueues.set(dispatchDto.rideId, timer);
    };

    pingNext();
  }

  // Called via an endpoint when a driver clicks "Accept"
  driverAccepted(rideId: string, driverId: string) {
    const timer = this.activeQueues.get(rideId);
    if (timer) {
      clearTimeout(timer);
      this.activeQueues.delete(rideId);
      console.log(`[Ride ${rideId}] Successfully accepted by ${driverId}!`);
      return true;
    }
    return false; // Ride was already accepted by someone else or timed out
  }
}
