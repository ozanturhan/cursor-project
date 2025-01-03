import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, SocialLink, Availability } from '@prisma/client';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { SocialPlatform } from './dto/social-link.dto';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

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

  const mockProfileService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    getPublicProfileByUsername: jest.fn(),
    addSocialLink: jest.fn(),
    updateSocialLink: jest.fn(),
    deleteSocialLink: jest.fn(),
    addAvailability: jest.fn(),
    updateAvailability: jest.fn(),
    deleteAvailability: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    service = module.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockReq = { user: { id: 'user-1' } };
      const mockProfileWithRelations = {
        ...mockProfile,
        socialLinks: [mockSocialLink],
        availabilities: [mockAvailability],
      };
      mockProfileService.getProfile.mockResolvedValue(mockProfileWithRelations);

      const result = await controller.getProfile(mockReq);

      expect(result).toBe(mockProfileWithRelations);
      expect(service.getProfile).toHaveBeenCalledWith(mockReq.user.id);
    });

    it('should return null if profile not found', async () => {
      const mockReq = { user: { id: 'user-1' } };
      mockProfileService.getProfile.mockResolvedValue(null);

      const result = await controller.getProfile(mockReq);

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockReq = { user: { id: 'user-1' } };
      const updateData = { bio: 'Updated bio' };
      const updatedProfile = { ...mockProfile, ...updateData };
      mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile(mockReq, updateData);

      expect(result).toBe(updatedProfile);
      expect(service.updateProfile).toHaveBeenCalledWith(mockReq.user.id, updateData);
    });
  });

  describe('getPublicProfile', () => {
    it('should return public profile when found', async () => {
      const mockProfile = {
        id: '1',
        username: 'testuser',
        fullName: 'Test User',
        profile: {
          bio: 'Test bio',
        },
      };

      mockProfileService.getPublicProfileByUsername.mockResolvedValue(mockProfile);

      const result = await controller.getPublicProfile('testuser');
      expect(result).toBe(mockProfile);
      expect(service.getPublicProfileByUsername).toHaveBeenCalledWith('testuser');
    });

    it('should throw NotFoundException when profile not found', async () => {
      mockProfileService.getPublicProfileByUsername.mockResolvedValue(null);

      await expect(controller.getPublicProfile('nonexistent'))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('addSocialLink', () => {
    it('should add social link', async () => {
      const mockReq = { user: { id: 'user-1' } };
      mockProfileService.getProfile.mockResolvedValue(mockProfile);
      mockProfileService.addSocialLink.mockResolvedValue(mockSocialLink);

      const result = await controller.addSocialLink(mockReq, {
        platform: SocialPlatform.GITHUB,
        url: 'https://github.com/test',
      });

      expect(result).toBe(mockSocialLink);
      expect(service.addSocialLink).toHaveBeenCalledWith(mockProfile.id, {
        platform: SocialPlatform.GITHUB,
        url: 'https://github.com/test',
      });
    });

    it('should throw NotFoundException if profile not found', async () => {
      const mockReq = { user: { id: 'user-1' } };
      mockProfileService.getProfile.mockResolvedValue(null);

      await expect(
        controller.addSocialLink(mockReq, {
          platform: SocialPlatform.GITHUB,
          url: 'https://github.com/test',
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addAvailability', () => {
    it('should add availability slot', async () => {
      const mockReq = { user: { id: 'user-1' } };
      mockProfileService.getProfile.mockResolvedValue(mockProfile);
      mockProfileService.addAvailability.mockResolvedValue(mockAvailability);

      const result = await controller.addAvailability(mockReq, {
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      });

      expect(result).toBe(mockAvailability);
      expect(service.addAvailability).toHaveBeenCalledWith(mockProfile.id, {
        dayOfWeek: 1,
        startHour: 9,
        startMinute: 0,
        endHour: 17,
        endMinute: 0,
      });
    });

    it('should throw NotFoundException if profile not found', async () => {
      const mockReq = { user: { id: 'user-1' } };
      mockProfileService.getProfile.mockResolvedValue(null);

      await expect(
        controller.addAvailability(mockReq, {
          dayOfWeek: 1,
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
        })
      ).rejects.toThrow(NotFoundException);
    });
  });
}); 