import { IsString, Matches, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty({
    description: 'Unique username for the profile',
    minLength: 3,
    maxLength: 30,
    pattern: '^[a-z0-9][a-z0-9_]*$',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z0-9][a-z0-9_]*$/, {
    message: 'Username must contain only lowercase letters, numbers, and underscores, and cannot start with underscore',
  })
  username!: string;
} 