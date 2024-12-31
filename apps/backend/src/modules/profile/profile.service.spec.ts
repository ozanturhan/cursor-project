import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ProfileService', () => {
  let service: ProfileService;
  let prisma: PrismaService;

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return a profile with social links and availability', async () => {
      const mockProfile = {
        id: '1',
        userId: '1',
        bio: 'Test bio',
        socialLinks: [],
        availabilities: [],
      };

      mockPrismaService.profile.findFirst.mockResolvedValue(mockProfile);

      const result = await service.getProfile('1');
      expect(result).toEqual(mockProfile);
      expect(prisma.profile.findFirst).toHaveBeenCalledWith({
        where: { userId: '1' },
        include: {
          socialLinks: true,
          availabilities: true,
        },
      });
    });
  });

  describe('updateProfile', () => {
    it('should create or update a profile', async () => {
      const mockProfile = {
        id: '1',
        userId: '1',
        bio: 'Updated bio',
        socialLinks: [],
        availabilities: [],
      };

      mockPrismaService.profile.findFirst.mockResolvedValue({ id: '1' });
      mockPrismaService.profile.upsert.mockResolvedValue(mockProfile);

      const result = await service.updateProfile('1', { bio: 'Updated bio' });
      expect(result).toEqual(mockProfile);
      expect(prisma.profile.upsert).toHaveBeenCalledWith({
        where: { id: '1' },
        create: {
          userId: '1',
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

  // Add more test cases for social links and availability methods
}); 