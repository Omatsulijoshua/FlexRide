import { Module } from '@nestjs/common';
import { RouteController } from './controllers/route.controller';
import { TripController } from './controllers/trip.controller';
import { BookingController } from './controllers/booking.controller';
import { ManifestService } from './services/manifest.service';

@Module({
  controllers: [RouteController, TripController, BookingController],
  providers: [ManifestService],
})
export class InterstateModule {}
