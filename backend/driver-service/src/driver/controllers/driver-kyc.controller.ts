import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { DriverService } from '../services/driver.service';
import { VerifyKycDto } from '../dto/verify-kyc.dto';
import { UploadDocumentDto } from '../dto/upload-document.dto';

@Controller('drivers/:driverId/kyc')
export class DriverKycController {
  constructor(private readonly driverService: DriverService) {}

  @Post('verify')
  verifyIdentity(@Param('driverId') driverId: string, @Body() kycDto: VerifyKycDto) {
    return this.driverService.verifyIdentity(driverId, kycDto);
  }

  @Post('documents')
  uploadDocument(@Param('driverId') driverId: string, @Body() docDto: UploadDocumentDto) {
    return this.driverService.uploadDocument(driverId, docDto);
  }

  @Get('status')
  getKycStatus(@Param('driverId') driverId: string) {
    return this.driverService.getDriverStatus(driverId);
  }
}
