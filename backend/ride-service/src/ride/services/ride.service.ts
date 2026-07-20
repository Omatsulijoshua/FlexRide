import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateRideDto } from '../dto/create-ride.dto';
import { UpdateRideStatusDto } from '../dto/update-ride-status.dto';
import { PricingService } from './pricing.service';
import { RideRepository } from '../ride.repository';

@Injectable()
export class RideService {
  constructor(
    private readonly pricingService: PricingService,
    private readonly rideRepository: RideRepository,
  ) {}

  estimateFare(createDto: CreateRideDto) {
    return this.pricingService.calculateFare(createDto);
  }

  async requestRide(createDto: CreateRideDto) {
    if (createDto.bookingMode === 'HOURLY_RENTAL' && !createDto.rentalHours) {
      throw new BadRequestException('rentalHours is required for hourly rental rides');
    }

    const estimation = this.pricingService.calculateFare(createDto);

    // Bidding Logic
    if (createDto.offeredFare !== undefined) {
      const minAllowedFare = estimation.totalFare * 0.5;
      if (createDto.offeredFare < minAllowedFare) {
        throw new BadRequestException(`Offered fare cannot be less than 50% of the calculated distance fare (₦${minAllowedFare})`);
      }
      estimation.totalFare = createDto.offeredFare;
    }

    const newRide = await this.rideRepository.createRide(createDto, estimation.totalFare);
    
    const dispatchUrl = process.env.DISPATCH_SERVICE_URL || 'http://dispatch-service:3007';

    fetch(`${dispatchUrl}/dispatch/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rideId: newRide.id, ...newRide }),
    }).catch(err => console.error('Failed to trigger dispatch:', err));

    return { success: true, rideId: newRide.id, estimatedFare: estimation.totalFare };
  }

  async scheduleRide(createDto: CreateRideDto) {
    if (!createDto.scheduledTime) {
      throw new BadRequestException('scheduledTime is required to schedule a ride');
    }

    if (createDto.bookingMode === 'HOURLY_RENTAL' && !createDto.rentalHours) {
      throw new BadRequestException('rentalHours is required for hourly rental rides');
    }

    const estimation = this.pricingService.calculateFare(createDto);
    const ride = await this.rideRepository.createRide(createDto, estimation.totalFare);
    const schedule = await this.rideRepository.createScheduledRide(ride.id, createDto);
    return { success: true, scheduleId: schedule.id, rideId: ride.id, scheduledTime: createDto.scheduledTime };
  }

  async updateStatus(rideId: string, updateDto: UpdateRideStatusDto) {
    const ride = await this.rideRepository.findRide(rideId);
    if (!ride) throw new NotFoundException('Ride not found');

    const validTransitions = {
      'REQUESTED': ['ACCEPTED', 'CANCELLED'],
      'ACCEPTED': ['ARRIVED', 'CANCELLED'],
      'ARRIVED': ['IN_PROGRESS', 'CANCELLED'],
      'IN_PROGRESS': ['COMPLETED'],
      'COMPLETED': [],
      'CANCELLED': []
    };

    if (!validTransitions[ride.status].includes(updateDto.status)) {
      throw new BadRequestException(`Cannot transition from ${ride.status} to ${updateDto.status}`);
    }

    return this.rideRepository.updateStatus(rideId, updateDto);
  }

  async getRide(rideId: string) {
    const ride = await this.rideRepository.findRide(rideId);
    if (!ride) throw new NotFoundException('Ride not found');
    return ride;
  }

  getScheduledRides(customerId: string) {
    return this.rideRepository.getScheduledRides(customerId);
  }
}
