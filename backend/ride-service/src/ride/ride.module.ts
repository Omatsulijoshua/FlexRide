import { Module } from '@nestjs/common';
import { RideService } from './services/ride.service';
import { PricingService } from './services/pricing.service';
import { RideController } from './controllers/ride.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { DatabaseService } from '../database/database.service';
import { RideRepository } from './ride.repository';

@Module({
  controllers: [RideController, ScheduleController],
  providers: [RideService, PricingService, RideRepository, DatabaseService],
})
export class RideModule {}
