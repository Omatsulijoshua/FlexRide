import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRegisteredEventDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}
