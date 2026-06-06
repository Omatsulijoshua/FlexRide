import { Injectable } from '@nestjs/common';
import { CreateRideDto } from '../dto/create-ride.dto';

@Injectable()
export class PricingService {
  readonly supportedVehicleCategories = [
    { code: 'ECONOMY', label: 'economy' },
    { code: 'BIKE', label: 'bike' },
    { code: 'KEKE', label: 'keke' },
    { code: 'SEDAN', label: 'sedan' },
    { code: 'SUV', label: 'suv' },
    { code: 'LUXURY', label: 'luxury' },
    { code: 'COURIER', label: 'courier delivery' },
    { code: 'DELIVERY_VAN', label: 'delivery van' },
    { code: 'TRUCK', label: 'truck' },
  ];

  // Base rates in NGN for Nigerian context
  private categoryRates = {
    'BIKE': { base: 200, perKm: 80, perMin: 10 },
    'KEKE': { base: 300, perKm: 100, perMin: 15 },
    'ECONOMY': { base: 500, perKm: 150, perMin: 20 },
    'SEDAN': { base: 800, perKm: 200, perMin: 25 },
    'SUV': { base: 1200, perKm: 300, perMin: 30 },
    'LUXURY': { base: 3000, perKm: 500, perMin: 50 },
    'COURIER': { base: 1200, perKm: 250, perMin: 30 },
    'DELIVERY_VAN': { base: 2000, perKm: 400, perMin: 40 },
    'TRUCK': { base: 10000, perKm: 1000, perMin: 100 },
  };

  calculateFare(dto: CreateRideDto) {
    // In production, we'd call Google Maps Distance Matrix API here
    // For scaffolding, we mock distance and duration
    
    // Naive distance calculation just for mock purposes
    const distanceKm = this.getDistanceFromLatLonInKm(
      dto.pickupLat, dto.pickupLng, dto.dropoffLat, dto.dropoffLng
    );
    const durationMins = distanceKm * 3; // Assuming 20km/h in city traffic

    const rates = this.categoryRates[dto.category] || this.categoryRates['ECONOMY'];
    
    // Calculate raw fare
    const rawFare = rates.base + (distanceKm * rates.perKm) + (durationMins * rates.perMin);
    
    const weatherRiskMultiplier = this.getWeatherRiskMultiplier();
    const surgeMultiplier = Number(
      (this.getDynamicSurgeMultiplier(distanceKm, dto.pickupLat, dto.pickupLng) * weatherRiskMultiplier).toFixed(2),
    );
    const promoDiscount = this.calculatePromoDiscount(dto.promoCode, rawFare);
    const totalFare = Math.max(0, (rawFare * surgeMultiplier) - promoDiscount);

    return {
      distanceKm: Number(distanceKm.toFixed(2)),
      durationMins: Math.ceil(durationMins),
      baseFare: rates.base,
      surgeMultiplier,
      promoCode: dto.promoCode || null,
      promoDiscount,
      totalFare: Number(totalFare.toFixed(2)),
      currency: 'NGN'
    };
  }

  private getDynamicSurgeMultiplier(distanceKm: number, pickupLat: number, pickupLng: number) {
    const heatMapDemandScore = Math.round(Math.abs(pickupLat * pickupLng)) % 100;
    const demandSurge = heatMapDemandScore > 70 ? 1.5 : heatMapDemandScore > 45 ? 1.2 : 1.0;
    const longTripSurge = distanceKm > 25 ? 1.1 : 1.0;
    return Number(Math.min(2.5, demandSurge * longTripSurge).toFixed(2));
  }

  private calculatePromoDiscount(promoCode: string | undefined, rawFare: number) {
    if (!promoCode) return 0;

    const promoCodes = {
      FLEX10: { type: 'PERCENT', value: 0.10, maxDiscount: 1000 },
      WELCOME500: { type: 'FLAT', value: 500, maxDiscount: 500 },
    };

    const promo = promoCodes[promoCode.toUpperCase()];
    if (!promo) return 0;

    const discount = promo.type === 'PERCENT' ? rawFare * promo.value : promo.value;
    return Number(Math.min(discount, promo.maxDiscount).toFixed(2));
  }

  private getWeatherRiskMultiplier() {
    // Weather-aware surge pricing hook for rain, flooding, and severe traffic conditions.
    return 1.0;
  }

  // Haversine formula for mock distance
  private getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = this.deg2rad(lat2-lat1);  
    const dLon = this.deg2rad(lon2-lon1); 
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
  }

  private deg2rad(deg) {
    return deg * (Math.PI/180);
  }
}
