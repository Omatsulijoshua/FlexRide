import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisGeoService {
  // Mocking Redis in-memory for Phase 8 Scaffold
  // In production, this uses `redisClient.geoadd()` and `redisClient.geosearch()`
  private mockRedisGeo = new Map<string, { lat: number; lng: number }>();

  updateDriverLocation(driverId: string, lat: number, lng: number) {
    this.mockRedisGeo.set(driverId, { lat, lng });
    // Production: await redisClient.geoadd('drivers:active', lng, lat, driverId);
  }

  getNearbyDrivers(lat: number, lng: number, radiusKm: number) {
    // Mocking a GEOSEARCH command
    // Production: await redisClient.geosearch('drivers:active', 'FROMLONLAT', lng, lat, 'BYRADIUS', radiusKm, 'km', 'WITHCOORD');
    
    const nearby = [];
    for (const [id, coords] of this.mockRedisGeo.entries()) {
      // Very naive distance check just for mock purposes
      const approxDist = Math.sqrt(Math.pow(coords.lat - lat, 2) + Math.pow(coords.lng - lng, 2)) * 111;
      if (approxDist <= radiusKm) {
        nearby.push({ driverId: id, lat: coords.lat, lng: coords.lng, distanceKm: approxDist });
      }
    }
    return nearby;
  }
}
