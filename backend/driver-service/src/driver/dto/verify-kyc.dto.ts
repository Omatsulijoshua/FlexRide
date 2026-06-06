import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class VerifyKycDto {
  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'NIN must be exactly 11 digits' })
  nin: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'BVN must be exactly 11 digits' })
  bvn: string;

  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsOptional()
  @IsString()
  facialVerificationImageUrl?: string;
}
