import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, SocialLink, Availability } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockPrismaService = {
    profile: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    socialLink: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    availability: {
      create: jest.fn(),
      findUnique: jest.fn(),
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
    platform: 'GITHUB',
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

  describe('getProfile', () => {
    it('should return user profile with social links and availability', async () => {
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
      mockPrismaService.profile.findFirst.mockResolvedValue(null);
      mockPrismaService.profile.upsert.mockResolvedValue(mockProfile);

      const result = await service.updateProfile('user-1', {
        bio: 'New bio',
      });

      expect(result).toBe(mockProfile);
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: '' },
        create: {
          userId: 'user-1',
          bio: 'New bio',
        },
        update: {
          bio: 'New bio',
        },
        include: {
          socialLinks: true,
          availabilities: true,
        },
      });
    });

    it('should update existing profile', async () => {
      mockPrismaService.profile.findFirst.mockResolvedValue(mockProfile);
      mockPrismaService.profile.upsert.mockResolvedValue({
        ...mockProfile,
        bio: 'Updated bio',
      });

      const result = await service.updateProfile('user-1', {
        bio: 'Updated bio',
      });

      expect(result.bio).toBe('Updated bio');
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: mockProfile.id },
        create: {
          userId: 'user-1',
          bio: 'Updated bio',
        },
        update: {
          bio: 'Updated bio',
        },
        include: {
          socialLinks: true,
          availabilities: true,
        },
      });
    });
  });

  describe('social links', () => {
    describe('addSocialLink', () => {
      it('should add a social link', async () => {
        mockPrismaService.socialLink.create.mockResolvedValue(mockSocialLink);

        const result = await service.addSocialLink('profile-1', {
          platform: 'GITHUB',
          url: 'https://github.com/test',
        });

        expect(result).toBe(mockSocialLink);
        expect(prisma.socialLink.create).toHaveBeenCalledWith({
          data: {
            platform: 'GITHUB',
            url: 'https://github.com/test',
            profileId: 'profile-1',
          },
        });
      });
    });

    describe('updateSocialLink', () => {
      it('should update a social link', async () => {
        mockPrismaService.socialLink.findUnique.mockResolvedValue({
          ...mockSocialLink,
          profile: { userId: 'user-1' },
        });
        mockPrismaService.socialLink.update.mockResolvedValue({
          ...mockSocialLink,
          url: 'https://github.com/updated',
        });

        const result = await service.updateSocialLink('social-1', {
          url: 'https://github.com/updated',
        });

        expect(result.url).toBe('https://github.com/updated');
        expect(prisma.socialLink.update).toHaveBeenCalledWith({
          where: { id: 'social-1' },
          data: { url: 'https://github.com/updated' },
        });
      });

      it('should throw NotFoundException if social link not found', async () => {
        mockPrismaService.socialLink.findUnique.mockResolvedValue(null);

        await expect(
          service.updateSocialLink('social-1', {
            url: 'https://github.com/updated',
          }),
        ).rejects.toThrow(NotFoundException);
        expect(prisma.socialLink.update).not.toHaveBeenCalled();
      });
    });

    describe('deleteSocialLink', () => {
      it('should delete a social link', async () => {
        mockPrismaService.socialLink.findUnique.mockResolvedValue({
          ...mockSocialLink,
          profile: { userId: 'user-1' },
        });
        mockPrismaService.socialLink.delete.mockResolvedValue(mockSocialLink);

        const result = await service.deleteSocialLink('social-1');

        expect(result).toBe(mockSocialLink);
        expect(prisma.socialLink.delete).toHaveBeenCalledWith({
          where: { id: 'social-1' },
        });
      });

      it('should throw NotFoundException if social link not found', async () => {
        mockPrismaService.socialLink.findUnique.mockResolvedValue(null);

        await expect(service.deleteSocialLink('social-1')).rejects.toThrow(
          NotFoundException,
        );
        expect(prisma.socialLink.delete).not.toHaveBeenCalled();
      });
    });
  });

  describe('availability', () => {
    describe('addAvailability', () => {
      it('should add an availability slot', async () => {
        mockPrismaService.availability.create.mockResolvedValue(mockAvailability);

        const result = await service.addAvailability('profile-1', {
          dayOfWeek: 1,
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
        });

        expect(result).toBe(mockAvailability);
        expect(prisma.availability.create).toHaveBeenCalledWith({
          data: {
            dayOfWeek: 1,
            startHour: 9,
            startMinute: 0,
            endHour: 17,
            endMinute: 0,
            profileId: 'profile-1',
          },
        });
      });

      it('should throw BadRequestException if end time is before start time', async () => {
        await expect(
          service.addAvailability('profile-1', {
            dayOfWeek: 1,
            startHour: 17,
            startMinute: 0,
            endHour: 9,
            endMinute: 0,
          }),
        ).rejects.toThrow(BadRequestException);
        expect(prisma.availability.create).not.toHaveBeenCalled();
      });
    });

    describe('updateAvailability', () => {
      it('should update an availability slot', async () => {
        mockPrismaService.availability.findUnique.mockResolvedValue({
          ...mockAvailability,
          profile: { userId: 'user-1' },
        });
        mockPrismaService.availability.update.mockResolvedValue({
          ...mockAvailability,
          startHour: 10,
          endHour: 18,
        });

        const result = await service.updateAvailability('availability-1', {
          startHour: 10,
          endHour: 18,
        });

        expect(result.startHour).toBe(10);
        expect(result.endHour).toBe(18);
        expect(prisma.availability.update).toHaveBeenCalledWith({
          where: { id: 'availability-1' },
          data: { startHour: 10, endHour: 18 },
        });
      });

      it('should throw NotFoundException if availability slot not found', async () => {
        mockPrismaService.availability.findUnique.mockResolvedValue(null);

        await expect(
          service.updateAvailability('availability-1', {
            startHour: 10,
            endHour: 18,
          }),
        ).rejects.toThrow(NotFoundException);
        expect(prisma.availability.update).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException if end time is before start time', async () => {
        mockPrismaService.availability.findUnique.mockResolvedValue({
          ...mockAvailability,
          profile: { userId: 'user-1' },
        });

        await expect(
          service.updateAvailability('availability-1', {
            startHour: 18,
            endHour: 10,
          }),
        ).rejects.toThrow(BadRequestException);
        expect(prisma.availability.update).not.toHaveBeenCalled();
      });
    });

    describe('deleteAvailability', () => {
      it('should delete an availability slot', async () => {
        mockPrismaService.availability.findUnique.mockResolvedValue({
          ...mockAvailability,
          profile: { userId: 'user-1' },
        });
        mockPrismaService.availability.delete.mockResolvedValue(mockAvailability);

        const result = await service.deleteAvailability('availability-1');

        expect(result).toBe(mockAvailability);
        expect(prisma.availability.delete).toHaveBeenCalledWith({
          where: { id: 'availability-1' },
        });
      });

      it('should throw NotFoundException if availability slot not found', async () => {
        mockPrismaService.availability.findUnique.mockResolvedValue(null);

        await expect(service.deleteAvailability('availability-1')).rejects.toThrow(
          NotFoundException,
        );
        expect(prisma.availability.delete).not.toHaveBeenCalled();
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