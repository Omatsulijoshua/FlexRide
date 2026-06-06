import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ManifestService } from '../services/manifest.service';
import { CreateTripDto } from '../dto/create-trip.dto';

@Controller('interstate/trips')
export class TripController {
  constructor(private readonly manifestService: ManifestService) {}

  @Post()
  scheduleTrip(@Body() tripDto: CreateTripDto) {
    return this.manifestService.createTrip(tripDto);
  }

  @Get(':routeId')
  getTripsForRoute(@Param('routeId') routeId: string) {
    return this.manifestService.getAvailableTrips(routeId);
  }
}
