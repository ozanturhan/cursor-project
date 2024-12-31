import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../modules/auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from './dto/social-link.dto';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/availability.dto';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the user profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.profileService.getProfile(user.id);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get public profile of a user' })
  @ApiResponse({ status: 200, description: 'Returns the public profile' })
  async getPublicProfile(@Param('userId') userId: string) {
    return this.profileService.getPublicProfile(userId);
  }

  @Put()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the updated profile' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() data: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.id, data);
  }

  @Post('social-links')
  @ApiOperation({ summary: 'Add a social link' })
  @ApiResponse({ status: 201, description: 'Returns the created social link' })
  async addSocialLink(
    @CurrentUser() user: any,
    @Body() data: CreateSocialLinkDto,
  ) {
    const profile = await this.profileService.getProfile(user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return this.profileService.addSocialLink(profile.id, data);
  }

  @Put('social-links/:id')
  @ApiOperation({ summary: 'Update a social link' })
  @ApiResponse({ status: 200, description: 'Returns the updated social link' })
  async updateSocialLink(
    @Param('id') id: string,
    @Body() data: UpdateSocialLinkDto,
  ) {
    return this.profileService.updateSocialLink(id, data);
  }

  @Delete('social-links/:id')
  @ApiOperation({ summary: 'Delete a social link' })
  @ApiResponse({ status: 200, description: 'Returns the deleted social link' })
  async deleteSocialLink(@Param('id') id: string) {
    return this.profileService.deleteSocialLink(id);
  }

  @Post('availability')
  @ApiOperation({ summary: 'Add availability slot' })
  @ApiResponse({ status: 201, description: 'Returns the created availability slot' })
  async addAvailability(
    @CurrentUser() user: any,
    @Body() data: CreateAvailabilityDto,
  ) {
    const profile = await this.profileService.getProfile(user.id);
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return this.profileService.addAvailability(profile.id, data);
  }

  @Put('availability/:id')
  @ApiOperation({ summary: 'Update availability slot' })
  @ApiResponse({ status: 200, description: 'Returns the updated availability slot' })
  async updateAvailability(
    @Param('id') id: string,
    @Body() data: UpdateAvailabilityDto,
  ) {
    return this.profileService.updateAvailability(id, data);
  }

  @Delete('availability/:id')
  @ApiOperation({ summary: 'Delete availability slot' })
  @ApiResponse({ status: 200, description: 'Returns the deleted availability slot' })
  async deleteAvailability(@Param('id') id: string) {
    return this.profileService.deleteAvailability(id);
  }
} 