import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OauthLoginDto {
  @IsString()
  @IsIn(['GOOGLE', 'APPLE', 'FACEBOOK'])
  provider: string;

  @IsString()
  @IsNotEmpty()
  oauthToken: string;

  @IsOptional()
  @IsString()
  email?: string;
}
