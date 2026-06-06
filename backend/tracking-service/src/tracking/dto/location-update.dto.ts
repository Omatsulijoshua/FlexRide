import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class LocationUpdateDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;

  @IsNumber()
  @Min(0)
  @Max(360)
  heading: number; // Direction the car is facing (0 = North, 90 = East)

  @IsOptional()
  @IsString()
  rideId?: string; // If null, the driver is just cruising and waiting for pings
}
