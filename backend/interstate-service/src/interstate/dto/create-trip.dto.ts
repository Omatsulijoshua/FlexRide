import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsString()
  @IsNotEmpty()
  routeId: string;

  @IsNumber()
  @Min(4)
  totalSeats: number;

  @IsString()
  @IsNotEmpty()
  departureTime: string; // ISO String
}
