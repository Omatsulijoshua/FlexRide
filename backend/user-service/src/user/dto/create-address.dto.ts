import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  label: string; // e.g., 'Home', 'Work'

  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}
