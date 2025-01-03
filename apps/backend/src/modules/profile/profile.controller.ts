import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from './dto/social-link.dto';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/availability.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  async getProfile(@Request() req: { user: { id: string } }) {
    return this.profileService.getProfile(req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the updated profile' })
  async updateProfile(
    @Request() req: { user: { id: string } },
    @Body() data: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(req.user.id, data);
  }

  @Get(':username')
  @ApiOperation({ summary: 'Get public profile by username' })
  @ApiResponse({ status: 200, description: 'Returns the public profile' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getPublicProfile(@Param('username') username: string) {
    const profile = await this.profileService.getPublicProfileByUsername(username);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  // Social Links
  @Post('social-links')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a social link' })
  @ApiResponse({ status: 201, description: 'Returns the created social link' })
  async addSocialLink(
    @Request() req: { user: { id: string } },
    @Body() data: CreateSocialLinkDto,
  ) {
    const profile = await this.profileService.getProfile(req.user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return this.profileService.addSocialLink(profile.id, data);
  }

  @Put('social-links/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a social link' })
  @ApiResponse({ status: 200, description: 'Returns the updated social link' })
  async updateSocialLink(
    @Param('id') id: string,
    @Body() data: UpdateSocialLinkDto,
  ) {
    return this.profileService.updateSocialLink(id, data);
  }

  @Delete('social-links/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a social link' })
  @ApiResponse({ status: 200, description: 'Returns the deleted social link' })
  async deleteSocialLink(@Param('id') id: string) {
    return this.profileService.deleteSocialLink(id);
  }

  // Availability
  @Post('availability')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add an availability slot' })
  @ApiResponse({ status: 201, description: 'Returns the created availability slot' })
  async addAvailability(
    @Request() req: { user: { id: string } },
    @Body() data: CreateAvailabilityDto,
  ) {
    const profile = await this.profileService.getProfile(req.user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return this.profileService.addAvailability(profile.id, data);
  }

  @Put('availability/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an availability slot' })
  @ApiResponse({ status: 200, description: 'Returns the updated availability slot' })
  async updateAvailability(
    @Param('id') id: string,
    @Body() data: UpdateAvailabilityDto,
  ) {
    return this.profileService.updateAvailability(id, data);
  }

  @Delete('availability/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete an availability slot' })
  @ApiResponse({ status: 200, description: 'Returns the deleted availability slot' })
  async deleteAvailability(@Param('id') id: string) {
    return this.profileService.deleteAvailability(id);
  }
} 