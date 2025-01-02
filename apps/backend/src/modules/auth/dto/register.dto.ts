import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  username!: string;

  @IsString()
  fullName!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
} 