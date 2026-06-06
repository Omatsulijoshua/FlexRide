import { Module } from '@nestjs/common';
import { AnalyticsController } from './controllers/analytics.controller';
import { ReportsService } from './services/reports.service';

@Module({
  controllers: [AnalyticsController],
  providers: [ReportsService],
})
export class AnalyticsModule {}
