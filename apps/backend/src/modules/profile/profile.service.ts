import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateSocialLinkDto, UpdateSocialLinkDto } from './dto/social-link.dto';
import { CreateAvailabilityDto, UpdateAvailabilityDto } from './dto/availability.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: {
          include: {
            socialLinks: true,
            availabilities: true,
          }
        },
      },
    });
  }

  async getPublicProfileByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        fullName: true,
        image: true,
        profiles: {
          select: {
            id: true,
            bio: true,
            title: true,
            location: true,
            profession: true,
            hourlyRate: true,
            socialLinks: {
              select: {
                id: true,
                platform: true,
                url: true,
              },
            },
            availabilities: {
              select: {
                id: true,
                dayOfWeek: true,
                startHour: true,
                endHour: true,
                startMinute: true,
                endMinute: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const profile = user.profiles[0];
    return {
      ...user,
      profile: profile ? {
        ...profile,
        hourlyRate: profile.hourlyRate?.toString(),
      } : null,
      socialLinks: profile?.socialLinks ?? [],
      availability: profile?.availabilities ?? [],
    };
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profiles: {
          include: {
            socialLinks: true,
            availabilities: true,
          }
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profiles.length === 0) {
      // Create new profile
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          profiles: {
            create: data,
          },
        },
        include: {
          profiles: {
            include: {
              socialLinks: true,
              availabilities: true,
            }
          },
        },
      });
    }

    // Update existing profile
    const profileId = user.profiles[0].id;
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        profiles: {
          update: {
            where: { id: profileId },
            data,
          },
        },
      },
      include: {
        profiles: {
          include: {
            socialLinks: true,
            availabilities: true,
          }
        },
      },
    });
  }

  // Social Links
  async addSocialLink(profileId: string, data: CreateSocialLinkDto) {
    return this.prisma.socialLink.create({
      data: {
        ...data,
        profileId,
      },
    });
  }

  async updateSocialLink(id: string, data: UpdateSocialLinkDto) {
    return this.prisma.socialLink.update({
      where: { id },
      data,
    });
  }

  async deleteSocialLink(id: string) {
    return this.prisma.socialLink.delete({
      where: { id },
    });
  }

  // Availability
  async addAvailability(profileId: string, data: CreateAvailabilityDto) {
    return this.prisma.availability.create({
      data: {
        ...data,
        profileId,
      },
    });
  }

  async updateAvailability(id: string, data: UpdateAvailabilityDto) {
    return this.prisma.availability.update({
      where: { id },
      data,
    });
  }

  async deleteAvailability(id: string) {
    return this.prisma.availability.delete({
      where: { id },
    });
  }
} 