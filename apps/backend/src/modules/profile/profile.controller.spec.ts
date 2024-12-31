import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockProfileService = {
    getProfile: jest.fn(),
    getPublicProfile: jest.fn(),
    updateProfile: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const mockUser = { id: '1' };
      const mockProfile = {
        id: '1',
        userId: '1',
        bio: 'Test bio',
      };

      mockProfileService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockUser);
      expect(result).toEqual(mockProfile);
      expect(service.getProfile).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('updateProfile', () => {
    it('should update the user profile', async () => {
      const mockUser = { id: '1' };
      const mockProfileData = { bio: 'Updated bio' };
      const mockUpdatedProfile = {
        id: '1',
        userId: '1',
        bio: 'Updated bio',
      };

      mockProfileService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      const result = await controller.updateProfile(mockUser, mockProfileData);
      expect(result).toEqual(mockUpdatedProfile);
      expect(service.updateProfile).toHaveBeenCalledWith(mockUser.id, mockProfileData);
    });
  });

  // Add more test cases for social links and availability endpoints
}); 