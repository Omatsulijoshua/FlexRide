import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { RideService } from '../services/ride.service';
import { CreateRideDto } from '../dto/create-ride.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  scheduleRide(@Body() createRideDto: CreateRideDto) {
    return this.rideService.scheduleRide(createRideDto);
  }

  @Get('customer/:customerId')
  getScheduledRides(@Param('customerId') customerId: string) {
    return this.rideService.getScheduledRides(customerId);
  }
}
