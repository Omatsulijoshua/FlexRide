import { Controller, Post, Body } from '@nestjs/common';
import { TripAnalysisService } from '../services/trip-analysis.service';
import { IdentityCheckService } from '../services/identity-check.service';
import { TripCompletedEventDto } from '../dto/trip-completed-event.dto';
import { UserRegisteredEventDto } from '../dto/user-registered-event.dto';

@Controller('fraud-events')
export class FraudController {
  constructor(
    private tripAnalysisService: TripAnalysisService,
    private identityCheckService: IdentityCheckService
  ) {}

  @Post('trip-completed')
  async handleTripCompleted(@Body() event: TripCompletedEventDto) {
    // Non-blocking analysis
    return this.tripAnalysisService.analyzeRouteDeviation(event);
  }

  @Post('user-registered')
  async handleUserRegistered(@Body() event: UserRegisteredEventDto) {
    // Non-blocking analysis
    return this.identityCheckService.analyzeRegistration(event);
  }
}
