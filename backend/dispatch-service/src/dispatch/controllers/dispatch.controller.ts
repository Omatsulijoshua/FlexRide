import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiMatchingService } from '../services/ai-matching.service';
import { DispatchRequestDto } from '../dto/dispatch-request.dto';

@Controller('dispatch')
export class DispatchController {
  constructor(private readonly aiMatchingService: AiMatchingService) {}

  @Post('start')
  @HttpCode(HttpStatus.ACCEPTED)
  startDispatch(@Body() dispatchDto: DispatchRequestDto) {
    // This is called by the Ride Service when a user clicks "Confirm Ride"
    // We return immediately to the user, while the AI ranks and pings drivers in the background
    this.aiMatchingService.findBestDriver(dispatchDto);
    return { status: 'DISPATCH_INITIATED', rideId: dispatchDto.rideId };
  }
}
