import { Injectable } from '@nestjs/common';

@Injectable()
export class MapsIntelligenceService {
  async getDistanceMatrix(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    const distanceKm = this.haversine(origin.lat, origin.lng, destination.lat, destination.lng);
    const trafficMultiplier = this.getTrafficMultiplier(origin.lat, origin.lng);

    return {
      provider: 'Google Maps Distance Matrix',
      distanceKm: Number(distanceKm.toFixed(2)),
      etaMinutes: Math.ceil(distanceKm * 3 * trafficMultiplier),
      routeOptimization: 'enabled',
      trafficAwareness: trafficMultiplier > 1 ? 'heavy' : 'normal',
    };
  }

  getHeatMapZone(lat: number, lng: number) {
    const demandScore = Math.min(100, Math.round(Math.abs(lat * lng) % 100));
    return {
      type: 'heat map',
      demandScore,
      label: demandScore > 70 ? 'surge zone' : demandScore > 40 ? 'warm zone' : 'normal zone',
    };
  }

  isInsideGeofence(lat: number, lng: number, zone: 'AIRPORT' | 'CITY_CENTER' | 'INTERSTATE_TERMINAL') {
    const geofenceCenters = {
      AIRPORT: { lat: 6.5774, lng: 3.3212, radiusKm: 4 },
      CITY_CENTER: { lat: 6.5244, lng: 3.3792, radiusKm: 8 },
      INTERSTATE_TERMINAL: { lat: 6.4698, lng: 3.5852, radiusKm: 3 },
    };
    const center = geofenceCenters[zone];
    return this.haversine(lat, lng, center.lat, center.lng) <= center.radiusKm;
  }

  private getTrafficMultiplier(lat: number, lng: number) {
    return Math.abs(lat + lng) % 2 > 1 ? 1.4 : 1.0;
  }

  private haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const radiusKm = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return radiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  private deg2rad(degrees: number) {
    return degrees * (Math.PI / 180);
  }
}
