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
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
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

  describe('social links', () => {
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
      });
    });
  });

  describe('availability', () => {
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
      });
    });
  });
}); 