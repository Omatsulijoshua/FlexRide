import { Controller, Post, Body, Param, Patch, Get } from '@nestjs/common';
import { RideService } from '../services/ride.service';
import { CreateRideDto } from '../dto/create-ride.dto';
import { UpdateRideStatusDto } from '../dto/update-ride-status.dto';

@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('estimate')
  estimateFare(@Body() createRideDto: CreateRideDto) {
    return this.rideService.estimateFare(createRideDto);
  }

  @Post()
  requestRide(@Body() createRideDto: CreateRideDto) {
    return this.rideService.requestRide(createRideDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') rideId: string, @Body() updateStatusDto: UpdateRideStatusDto) {
    return this.rideService.updateStatus(rideId, updateStatusDto);
  }

  @Get(':id')
  getRide(@Param('id') rideId: string) {
    return this.rideService.getRide(rideId);
  }
}
