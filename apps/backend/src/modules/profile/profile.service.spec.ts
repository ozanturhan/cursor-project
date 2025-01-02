import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, SocialLink, Availability } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { SocialPlatform } from './dto/social-link.dto';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockProfile: Profile = {
    id: 'profile-1',
    userId: 'user-1',
    bio: 'Test bio',
    title: 'Developer',
    location: 'Berlin',
    profession: 'Software Engineer',
    hourlyRate: new Decimal(100),
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSocialLink: SocialLink = {
    id: 'social-1',
    profileId: 'profile-1',
    platform: SocialPlatform.GITHUB,
    url: 'https://github.com/test',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAvailability: Availability = {
    id: 'availability-1',
    profileId: 'profile-1',
    dayOfWeek: 1,
    startHour: 9,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    profile: {
      findFirst: jest.fn(),
      upsert: jest.fn(),
    },
    socialLink: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    availability: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile with relations', async () => {
      const mockProfileWithRelations = {
        ...mockProfile,
        socialLinks: [mockSocialLink],
        availabilities: [mockAvailability],
      };
      mockPrismaService.profile.findFirst.mockResolvedValue(mockProfileWithRelations);

      const result = await service.getProfile('user-1');

      expect(result).toBe(mockProfileWithRelations);
      expect(prisma.profile.findFirst).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: {
          socialLinks: true,
          availabilities: true,
        },
      });
    });

    it('should return null if profile not found', async () => {
      mockPrismaService.profile.findFirst.mockResolvedValue(null);

      const result = await service.getProfile('user-1');

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should create profile if it does not exist', async () => {
      const updateData = { bio: 'New bio' };
      const newProfile = { ...mockProfile, ...updateData };
      mockPrismaService.profile.findFirst.mockResolvedValue(null);
      mockPrismaService.profile.upsert.mockResolvedValue(newProfile);

      const result = await service.updateProfile('user-1', updateData);

      expect(result).toBe(newProfile);
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: '' },
        create: {
          userId: 'user-1',
          ...updateData,
        },
        update: updateData,
        include: {
          socialLinks: true,
          availabilities: true,
        },
      });
    });

    it('should update existing profile', async () => {
      const updateData = { bio: 'Updated bio' };
      const updatedProfile = { ...mockProfile, ...updateData };
      mockPrismaService.profile.findFirst.mockResolvedValue(mockProfile);
      mockPrismaService.profile.upsert.mockResolvedValue(updatedProfile);

      const result = await service.updateProfile('user-1', updateData);

      expect(result).toBe(updatedProfile);
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: mockProfile.id },
        create: {
          userId: 'user-1',
          ...updateData,
        },
        update: updateData,
        include: {
          socialLinks: true,
          availabilities: true,
        },
      });
    });
  });

  describe('getPublicProfile', () => {
    it('should return public profile with social links, availability, and user info', async () => {
      const mockPublicProfile = {
        ...mockProfile,
        socialLinks: [mockSocialLink],
        availabilities: [mockAvailability],
        user: {
          fullName: 'Test User',
          email: 'test@example.com',
          image: null,
        },
      };
      mockPrismaService.profile.findFirst.mockResolvedValue(mockPublicProfile);

      const result = await service.getPublicProfile('user-1');

      expect(result).toBe(mockPublicProfile);
      expect(prisma.profile.findFirst).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
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
    });

    it('should return null if profile not found', async () => {
      mockPrismaService.profile.findFirst.mockResolvedValue(null);

      const result = await service.getPublicProfile('user-1');

      expect(result).toBeNull();
    });
  });
}); 