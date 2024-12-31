import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, SocialLink, Availability } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.profile.findFirst({
      where: { userId },
      include: {
        socialLinks: true,
        availabilities: true,
      },
    });
  }

  async updateProfile(userId: string, data: Partial<Profile>) {
    const profile = await this.getProfile(userId);
    return this.prisma.profile.upsert({
      where: { id: profile?.id ?? '' },
      create: {
        userId,
        ...data,
      },
      update: data,
      include: {
        socialLinks: true,
        availabilities: true,
      },
    });
  }

  async addSocialLink(profileId: string, data: Omit<SocialLink, 'id' | 'profileId' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.socialLink.create({
      data: {
        ...data,
        profileId,
      },
    });
  }

  async updateSocialLink(id: string, data: Partial<SocialLink>) {
    const socialLink = await this.prisma.socialLink.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    return this.prisma.socialLink.update({
      where: { id },
      data,
    });
  }

  async deleteSocialLink(id: string) {
    const socialLink = await this.prisma.socialLink.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    return this.prisma.socialLink.delete({
      where: { id },
    });
  }

  async addAvailability(profileId: string, data: Omit<Availability, 'id' | 'profileId' | 'createdAt' | 'updatedAt'>) {
    if (data.startHour >= data.endHour) {
      throw new BadRequestException('End time must be after start time');
    }

    return this.prisma.availability.create({
      data: {
        ...data,
        profileId,
      },
    });
  }

  async updateAvailability(id: string, data: Partial<Availability>) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!availability) {
      throw new NotFoundException('Availability slot not found');
    }

    const startHour = data.startHour ?? availability.startHour;
    const endHour = data.endHour ?? availability.endHour;

    if (startHour >= endHour) {
      throw new BadRequestException('End time must be after start time');
    }

    return this.prisma.availability.update({
      where: { id },
      data,
    });
  }

  async deleteAvailability(id: string) {
    const availability = await this.prisma.availability.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!availability) {
      throw new NotFoundException('Availability slot not found');
    }

    return this.prisma.availability.delete({
      where: { id },
    });
  }

  async getPublicProfile(userId: string) {
    return this.prisma.profile.findFirst({
      where: { userId },
      include: {
        socialLinks: true,
        availabilities: true,
        user: {
          select: {
            fullName: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }
} 