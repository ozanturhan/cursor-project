import { IsString, IsUrl, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SocialPlatform {
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  GITHUB = 'GITHUB',
  WEBSITE = 'WEBSITE',
}

export class CreateSocialLinkDto {
  @ApiProperty({ enum: SocialPlatform })
  @IsEnum(SocialPlatform)
  platform!: SocialPlatform;

  @ApiProperty()
  @IsString()
  @IsUrl()
  url!: string;
}

export class UpdateSocialLinkDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsUrl()
  url!: string;
} 