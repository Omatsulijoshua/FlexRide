import { Module } from '@nestjs/common';
import { TrackingGateway } from './gateways/tracking.gateway';
import { RedisGeoService } from './services/redis-geo.service';
import { MapsIntelligenceService } from './services/maps-intelligence.service';

@Module({
  providers: [TrackingGateway, RedisGeoService, MapsIntelligenceService],
})
export class TrackingModule {}
