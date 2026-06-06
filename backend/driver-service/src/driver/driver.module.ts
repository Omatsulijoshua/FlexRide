import { Module } from '@nestjs/common';
import { DriverService } from './services/driver.service';
import { DriverKycController } from './controllers/driver-kyc.controller';
import { VehicleController } from './controllers/vehicle.controller';

@Module({
  controllers: [DriverKycController, VehicleController],
  providers: [DriverService],
})
export class DriverModule {}
