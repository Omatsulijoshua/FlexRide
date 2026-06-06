import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Must be a valid URL for profile picture' })
  profilePictureUrl?: string;

  @IsOptional()
  @IsString()
  ridePreferences?: string;
}
