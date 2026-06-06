import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard-overview')
  getOverviewMetrics(@Query('dateRange') dateRange: string) {
    return this.reportsService.getOverviewMetrics(dateRange);
  }

  @Get('revenue-chart')
  getRevenueChartData(@Query('days') days: number = 7) {
    return this.reportsService.getRevenueChartData(days);
  }

  @Get('driver-performance')
  getTopDrivers() {
    return this.reportsService.getTopDrivers();
  }
}
