import { Module } from '@nestjs/common';
import { FraudController } from './controllers/fraud.controller';
import { TripAnalysisService } from './services/trip-analysis.service';
import { IdentityCheckService } from './services/identity-check.service';

@Module({
  controllers: [FraudController],
  providers: [TripAnalysisService, IdentityCheckService],
})
export class FraudModule {}
