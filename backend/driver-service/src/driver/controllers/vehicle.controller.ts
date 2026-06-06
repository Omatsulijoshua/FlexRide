import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { DriverService } from '../services/driver.service';
import { RegisterVehicleDto } from '../dto/register-vehicle.dto';

@Controller('drivers/:driverId/vehicles')
export class VehicleController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  registerVehicle(@Param('driverId') driverId: string, @Body() vehicleDto: RegisterVehicleDto) {
    return this.driverService.registerVehicle(driverId, vehicleDto);
  }

  @Get()
  getVehicles(@Param('driverId') driverId: string) {
    return this.driverService.getVehicles(driverId);
  }
}
