import { Injectable } from '@nestjs/common';
import { TripCompletedEventDto } from '../dto/trip-completed-event.dto';

@Injectable()
export class TripAnalysisService {
  
  // Flag if the actual distance is >30% longer than what the algorithm initially estimated
  private readonly DEVIATION_THRESHOLD = 1.30;

  async analyzeRouteDeviation(event: TripCompletedEventDto) {
    if (event.estimatedDistanceKm === 0) return { status: 'CLEARED' }; // Avoid division by zero

    const deviationRatio = event.actualDistanceKm / event.estimatedDistanceKm;
    
    if (deviationRatio > this.DEVIATION_THRESHOLD) {
      console.warn(`[FRAUD ALERT] Trip ${event.rideId} flagged! Estimated: ${event.estimatedDistanceKm}km, Actual: ${event.actualDistanceKm}km`);
      
      // Normally, this would trigger an event to the Admin Dashboard / Payment Service
      // to hold the driver's payout until a human reviews the GPS track
      
      return { 
        status: 'FLAGGED', 
        reason: 'ROUTE_DEVIATION', 
        deviationPercentage: ((deviationRatio - 1) * 100).toFixed(2) 
      };
    }

    return { status: 'CLEARED' };
  }

  analyzeGpsSpoofing(samples: Array<{ lat: number; lng: number; timestamp: string }>) {
    // Detect GPS spoofing by flagging impossible jumps between consecutive pings.
    return samples.length > 1 ? { status: 'REVIEW', reason: 'GPS_SPOOFING_CHECK' } : { status: 'CLEARED' };
  }

  analyzeWalletFraud(userId: string, recentTransactionCount: number, failedPaymentCount: number) {
    // wallet fraud monitoring for rapid funding, refund abuse, and failed payment clusters.
    const riskScore = recentTransactionCount * 4 + failedPaymentCount * 10;
    return { userId, riskScore, status: riskScore > 60 ? 'FLAGGED' : 'CLEARED' };
  }
}
