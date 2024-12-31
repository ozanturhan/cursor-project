import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile, SocialLink, Availability } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
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
    getPublicProfile: jest.fn(),
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
      const mockUser = { id: 'user-1' };
      const mockProfileWithRelations = {
        ...mockProfile,
        socialLinks: [mockSocialLink],
        availabilities: [mockAvailability],
      };
      mockProfileService.getProfile.mockResolvedValue(mockProfileWithRelations);

      const result = await controller.getProfile(mockUser);

      expect(result).toBe(mockProfileWithRelations);
      expect(service.getProfile).toHaveBeenCalledWith(mockUser.id);
    });

    it('should return null if profile not found', async () => {
      const mockUser = { id: 'user-1' };
      mockProfileService.getProfile.mockResolvedValue(null);

      const result = await controller.getProfile(mockUser);

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser = { id: 'user-1' };
      const updateData = { bio: 'Updated bio' };
      const updatedProfile = { ...mockProfile, ...updateData };
      mockProfileService.updateProfile.mockResolvedValue(updatedProfile);

      const result = await controller.updateProfile(mockUser, updateData);

      expect(result).toBe(updatedProfile);
      expect(service.updateProfile).toHaveBeenCalledWith(mockUser.id, updateData);
    });
  });

  describe('getPublicProfile', () => {
    it('should return public profile', async () => {
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
      mockProfileService.getPublicProfile.mockResolvedValue(mockPublicProfile);

      const result = await controller.getPublicProfile('user-1');

      expect(result).toBe(mockPublicProfile);
      expect(service.getPublicProfile).toHaveBeenCalledWith('user-1');
    });

    it('should return null if profile not found', async () => {
      mockProfileService.getPublicProfile.mockResolvedValue(null);

      const result = await controller.getPublicProfile('user-1');

      expect(result).toBeNull();
    });
  });

  describe('social links', () => {
    describe('addSocialLink', () => {
      it('should add a social link', async () => {
        const mockUser = { id: 'user-1' };
        mockProfileService.getProfile.mockResolvedValue(mockProfile);
        mockProfileService.addSocialLink.mockResolvedValue(mockSocialLink);

        const result = await controller.addSocialLink(mockUser, {
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
        const mockUser = { id: 'user-1' };
        mockProfileService.getProfile.mockResolvedValue(null);

        await expect(
          controller.addSocialLink(mockUser, {
            platform: SocialPlatform.GITHUB,
            url: 'https://github.com/test',
          }),
        ).rejects.toThrow(NotFoundException);
        expect(service.addSocialLink).not.toHaveBeenCalled();
      });
    });

    describe('updateSocialLink', () => {
      it('should update a social link', async () => {
        const updatedLink = {
          ...mockSocialLink,
          url: 'https://github.com/updated',
        };
        mockProfileService.updateSocialLink.mockResolvedValue(updatedLink);

        const result = await controller.updateSocialLink('social-1', {
          url: 'https://github.com/updated',
        });

        expect(result).toBe(updatedLink);
        expect(service.updateSocialLink).toHaveBeenCalledWith('social-1', {
          url: 'https://github.com/updated',
        });
      });

      it('should throw NotFoundException if social link not found', async () => {
        mockProfileService.updateSocialLink.mockRejectedValue(
          new NotFoundException(),
        );

        await expect(
          controller.updateSocialLink('social-1', {
            url: 'https://github.com/updated',
          }),
        ).rejects.toThrow(NotFoundException);
      });
    });

    describe('deleteSocialLink', () => {
      it('should delete a social link', async () => {
        mockProfileService.deleteSocialLink.mockResolvedValue(mockSocialLink);

        const result = await controller.deleteSocialLink('social-1');

        expect(result).toBe(mockSocialLink);
        expect(service.deleteSocialLink).toHaveBeenCalledWith('social-1');
      });

      it('should throw NotFoundException if social link not found', async () => {
        mockProfileService.deleteSocialLink.mockRejectedValue(
          new NotFoundException(),
        );

        await expect(controller.deleteSocialLink('social-1')).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('availability', () => {
    describe('addAvailability', () => {
      it('should add an availability slot', async () => {
        const mockUser = { id: 'user-1' };
        mockProfileService.getProfile.mockResolvedValue(mockProfile);
        mockProfileService.addAvailability.mockResolvedValue(mockAvailability);

        const result = await controller.addAvailability(mockUser, {
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
        const mockUser = { id: 'user-1' };
        mockProfileService.getProfile.mockResolvedValue(null);

        await expect(
          controller.addAvailability(mockUser, {
            dayOfWeek: 1,
            startHour: 9,
            startMinute: 0,
            endHour: 17,
            endMinute: 0,
          }),
        ).rejects.toThrow(NotFoundException);
        expect(service.addAvailability).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException if end time is before start time', async () => {
        const mockUser = { id: 'user-1' };
        mockProfileService.getProfile.mockResolvedValue(mockProfile);
        mockProfileService.addAvailability.mockRejectedValue(
          new BadRequestException(),
        );

        await expect(
          controller.addAvailability(mockUser, {
            dayOfWeek: 1,
            startHour: 17,
            startMinute: 0,
            endHour: 9,
            endMinute: 0,
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('updateAvailability', () => {
      it('should update an availability slot', async () => {
        const updatedSlot = {
          ...mockAvailability,
          startHour: 10,
          endHour: 18,
        };
        mockProfileService.updateAvailability.mockResolvedValue(updatedSlot);

        const result = await controller.updateAvailability('availability-1', {
          startHour: 10,
          endHour: 18,
        });

        expect(result).toBe(updatedSlot);
        expect(service.updateAvailability).toHaveBeenCalledWith(
          'availability-1',
          {
            startHour: 10,
            endHour: 18,
          },
        );
      });

      it('should throw NotFoundException if availability slot not found', async () => {
        mockProfileService.updateAvailability.mockRejectedValue(
          new NotFoundException(),
        );

        await expect(
          controller.updateAvailability('availability-1', {
            startHour: 10,
            endHour: 18,
          }),
        ).rejects.toThrow(NotFoundException);
      });

      it('should throw BadRequestException if end time is before start time', async () => {
        mockProfileService.updateAvailability.mockRejectedValue(
          new BadRequestException(),
        );

        await expect(
          controller.updateAvailability('availability-1', {
            startHour: 18,
            endHour: 10,
          }),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('deleteAvailability', () => {
      it('should delete an availability slot', async () => {
        mockProfileService.deleteAvailability.mockResolvedValue(mockAvailability);

        const result = await controller.deleteAvailability('availability-1');

        expect(result).toBe(mockAvailability);
        expect(service.deleteAvailability).toHaveBeenCalledWith('availability-1');
      });

      it('should throw NotFoundException if availability slot not found', async () => {
        mockProfileService.deleteAvailability.mockRejectedValue(
          new NotFoundException(),
        );

        await expect(
          controller.deleteAvailability('availability-1'),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
}); 