import { Injectable } from '@nestjs/common';
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

  async addAvailability(profileId: string, data: Omit<Availability, 'id' | 'profileId' | 'createdAt' | 'updatedAt'>) {
    return this.prisma.availability.create({
      data: {
        ...data,
        profileId,
      },
    });
  }

  async updateAvailability(id: string, data: Partial<Availability>) {
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