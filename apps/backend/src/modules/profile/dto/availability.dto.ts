import { IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Day of week (1-7, Monday-Sunday)', minimum: 1, maximum: 7 })
  @IsInt()
  @Min(1)
  @Max(7)
  dayOfWeek!: number;

  @ApiProperty({ description: 'Start hour (0-23)', minimum: 0, maximum: 23 })
  @IsInt()
  @Min(0)
  @Max(23)
  startHour!: number;

  @ApiProperty({ description: 'Start minute (0-59)', minimum: 0, maximum: 59 })
  @IsInt()
  @Min(0)
  @Max(59)
  startMinute!: number;

  @ApiProperty({ description: 'End hour (0-23)', minimum: 0, maximum: 23 })
  @IsInt()
  @Min(0)
  @Max(23)
  endHour!: number;

  @ApiProperty({ description: 'End minute (0-59)', minimum: 0, maximum: 59 })
  @IsInt()
  @Min(0)
  @Max(59)
  endMinute!: number;
}

export class UpdateAvailabilityDto {
  @ApiProperty({ description: 'Start hour (0-23)', minimum: 0, maximum: 23, required: false })
  @IsInt()
  @Min(0)
  @Max(23)
  startHour?: number;

  @ApiProperty({ description: 'Start minute (0-59)', minimum: 0, maximum: 59, required: false })
  @IsInt()
  @Min(0)
  @Max(59)
  startMinute?: number;

  @ApiProperty({ description: 'End hour (0-23)', minimum: 0, maximum: 23, required: false })
  @IsInt()
  @Min(0)
  @Max(23)
  endHour?: number;

  @ApiProperty({ description: 'End minute (0-59)', minimum: 0, maximum: 59, required: false })
  @IsInt()
  @Min(0)
  @Max(59)
  endMinute?: number;
} 