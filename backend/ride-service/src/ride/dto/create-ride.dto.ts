import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class WaypointDto {
  @IsNumber() @Min(-90) @Max(90) lat: number;
  @IsNumber() @Min(-180) @Max(180) lng: number;
  @IsString() address: string;
}

export class CreateRideDto {
  @IsString() @IsNotEmpty() customerId: string;

  @IsNumber() @Min(-90) @Max(90) pickupLat: number;
  @IsNumber() @Min(-180) @Max(180) pickupLng: number;
  @IsString() @IsNotEmpty() pickupAddress: string;

  @IsNumber() @Min(-90) @Max(90) dropoffLat: number;
  @IsNumber() @Min(-180) @Max(180) dropoffLng: number;
  @IsString() @IsNotEmpty() dropoffAddress: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WaypointDto)
  stops?: WaypointDto[];

  @IsString()
  @IsNotEmpty()
  @IsIn(['ECONOMY', 'BIKE', 'KEKE', 'SEDAN', 'SUV', 'LUXURY', 'COURIER', 'DELIVERY_VAN', 'TRUCK'])
  category: string;

  @IsOptional()
  @IsString()
  scheduledTime?: string; // ISO DateTime string

  @IsOptional()
  @IsString()
  promoCode?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ONE_WAY', 'ROUND_TRIP', 'HOURLY_RENTAL', 'POOL'])
  bookingMode?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  rentalHours?: number;
}
