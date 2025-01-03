import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { SocialPlatform } from './dto/social-link.dto';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
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

  describe('getPublicProfileByUsername', () => {
    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.getPublicProfileByUsername('nonexistent');
      expect(result).toBeNull();
    });

    it('should return formatted profile when user exists', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        fullName: 'Test User',
        image: null,
        profiles: [{
          id: '1',
          bio: 'Test bio',
          title: 'Developer',
          location: 'Test City',
          profession: 'Software Engineer',
          hourlyRate: '100',
          socialLinks: [],
          availabilities: [],
        }],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getPublicProfileByUsername('testuser');
      expect(result).toEqual({
        ...mockUser,
        profile: {
          ...mockUser.profiles[0],
          hourlyRate: mockUser.profiles[0].hourlyRate.toString(),
        },
        socialLinks: [],
        availability: [],
      });
    });
  });

  describe('updateProfile', () => {
    it('should throw NotFoundException when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateProfile('nonexistent', {}))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should create profile when user has no profile', async () => {
      const mockUser = {
        id: '1',
        profiles: [],
      };

      const updateData = {
        bio: 'New bio',
        title: 'New title',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockImplementation(({ data }) => ({
        ...mockUser,
        profiles: [{ id: '1', ...data.profiles.create }],
      }));

      const result = await service.updateProfile(mockUser.id, updateData);
      expect(result.profiles[0]).toMatchObject(updateData);
    });

    it('should update existing profile', async () => {
      const mockUser = {
        id: '1',
        profiles: [{ id: '1', bio: 'Old bio' }],
      };

      const updateData = {
        bio: 'Updated bio',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockImplementation(({ data }) => ({
        ...mockUser,
        profiles: [{ ...mockUser.profiles[0], ...data.profiles.update.data }],
      }));

      const result = await service.updateProfile(mockUser.id, updateData);
      expect(result.profiles[0].bio).toBe(updateData.bio);
    });
  });

  describe('Social Links', () => {
    describe('addSocialLink', () => {
      it('should create a new social link', async () => {
        const mockSocialLink = {
          id: '1',
          profileId: 'profile-1',
          platform: SocialPlatform.GITHUB,
          url: 'https://github.com/test',
        };

        mockPrismaService.socialLink.create.mockResolvedValue(mockSocialLink);

        const result = await service.addSocialLink('profile-1', {
          platform: SocialPlatform.GITHUB,
          url: 'https://github.com/test',
        });

        expect(result).toEqual(mockSocialLink);
        expect(prisma.socialLink.create).toHaveBeenCalledWith({
          data: {
            profileId: 'profile-1',
            platform: SocialPlatform.GITHUB,
            url: 'https://github.com/test',
          },
        });
      });
    });

    describe('updateSocialLink', () => {
      it('should update an existing social link', async () => {
        const mockSocialLink = {
          id: '1',
          platform: 'GITHUB',
          url: 'https://github.com/updated',
        };

        mockPrismaService.socialLink.update.mockResolvedValue(mockSocialLink);

        const result = await service.updateSocialLink('1', {
          url: 'https://github.com/updated',
        });

        expect(result).toEqual(mockSocialLink);
        expect(prisma.socialLink.update).toHaveBeenCalledWith({
          where: { id: '1' },
          data: { url: 'https://github.com/updated' },
        });
      });
    });

    describe('deleteSocialLink', () => {
      it('should delete a social link', async () => {
        const mockSocialLink = {
          id: '1',
          platform: 'GITHUB',
          url: 'https://github.com/test',
        };

        mockPrismaService.socialLink.delete.mockResolvedValue(mockSocialLink);

        const result = await service.deleteSocialLink('1');

        expect(result).toEqual(mockSocialLink);
        expect(prisma.socialLink.delete).toHaveBeenCalledWith({
          where: { id: '1' },
        });
      });
    });
  });

  describe('Availability', () => {
    describe('addAvailability', () => {
      it('should create a new availability slot', async () => {
        const mockAvailability = {
          id: '1',
          profileId: 'profile-1',
          dayOfWeek: 1,
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
        };

        mockPrismaService.availability.create.mockResolvedValue(mockAvailability);

        const result = await service.addAvailability('profile-1', {
          dayOfWeek: 1,
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
        });

        expect(result).toEqual(mockAvailability);
        expect(prisma.availability.create).toHaveBeenCalledWith({
          data: {
            profileId: 'profile-1',
            dayOfWeek: 1,
            startHour: 9,
            startMinute: 0,
            endHour: 17,
            endMinute: 0,
          },
        });
      });
    });

    describe('updateAvailability', () => {
      it('should update an existing availability slot', async () => {
        const mockAvailability = {
          id: '1',
          dayOfWeek: 1,
          startHour: 10,
          startMinute: 0,
          endHour: 18,
          endMinute: 0,
        };

        mockPrismaService.availability.update.mockResolvedValue(mockAvailability);

        const result = await service.updateAvailability('1', {
          startHour: 10,
          endHour: 18,
        });

        expect(result).toEqual(mockAvailability);
        expect(prisma.availability.update).toHaveBeenCalledWith({
          where: { id: '1' },
          data: {
            startHour: 10,
            endHour: 18,
          },
        });
      });
    });

    describe('deleteAvailability', () => {
      it('should delete an availability slot', async () => {
        const mockAvailability = {
          id: '1',
          dayOfWeek: 1,
          startHour: 9,
          endHour: 17,
        };

        mockPrismaService.availability.delete.mockResolvedValue(mockAvailability);

        const result = await service.deleteAvailability('1');

        expect(result).toEqual(mockAvailability);
        expect(prisma.availability.delete).toHaveBeenCalledWith({
          where: { id: '1' },
        });
      });
    });
  });
}); 