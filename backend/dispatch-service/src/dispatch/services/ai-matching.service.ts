import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { DispatchRequestDto } from '../dto/dispatch-request.dto';

@Injectable()
export class AiMatchingService {
  constructor(private queueService: QueueService) {}

  // In production, we'd pull these from the Driver Service DB
  private mockDriverDB = {
    'driver_1': { rating: 4.9, acceptanceRate: 0.95, cancellationRisk: 0.04 },
    'driver_2': { rating: 4.2, acceptanceRate: 0.60, cancellationRisk: 0.28 },
    'driver_3': { rating: 4.7, acceptanceRate: 0.85, cancellationRisk: 0.09 },
  };

  async findBestDriver(dispatchDto: DispatchRequestDto) {
    // 1. Ask Tracking Service (Redis) for nearby drivers
    // Mocking the Redis GEO query response here
    const nearbyDrivers = [
      { id: 'driver_1', distanceKm: 2.1, etaMinutes: 7 },
      { id: 'driver_2', distanceKm: 0.5, etaMinutes: 4 }, // Much closer, but higher cancellation risk
      { id: 'driver_3', distanceKm: 1.2, etaMinutes: 5 },
    ];

    if (nearbyDrivers.length === 0) {
      console.log(`[Ride ${dispatchDto.rideId}] No drivers found in 3km radius.`);
      return;
    }

    // 2. Score them based on hybrid AI dispatch logic:
    // nearest driver, best-rated driver, lowest ETA, and lowest cancellation risk.
    const rankedDrivers = nearbyDrivers.map(driver => {
      const stats = this.mockDriverDB[driver.id];
      const score = this.calculateScore(
        driver.distanceKm,
        stats.rating,
        stats.acceptanceRate,
        driver.etaMinutes,
        stats.cancellationRisk,
      );
      return { ...driver, cancellationRisk: stats.cancellationRisk, score };
    });

    // 3. Sort highest score first
    rankedDrivers.sort((a, b) => b.score - a.score);

    console.log(`[Ride ${dispatchDto.rideId}] Ranked Drivers:`, rankedDrivers.map(d => `${d.id} (Score: ${d.score.toFixed(2)})`));

    // 4. Send to the Waterfall Queue
    const orderedDriverIds = rankedDrivers.map(d => d.id);
    this.queueService.startWaterfallPing(dispatchDto, orderedDriverIds);
  }

  private calculateScore(
    distanceKm: number,
    rating: number,
    acceptanceRate: number,
    etaMinutes: number,
    cancellationRisk: number,
  ): number {
    const distanceScore = Math.max(0, 3 - distanceKm) * 10; // 0 to 30 points
    const ratingScore = rating * 10; // 0 to 50 points
    const acceptanceScore = acceptanceRate * 15; // 0 to 15 points
    const etaScore = Math.max(0, 12 - etaMinutes) * 2; // lowest ETA wins up to 24 points
    const cancellationRiskPenalty = cancellationRisk * 45; // lower cancellation risk wins

    return distanceScore + ratingScore + acceptanceScore + etaScore - cancellationRiskPenalty;
  }
}
