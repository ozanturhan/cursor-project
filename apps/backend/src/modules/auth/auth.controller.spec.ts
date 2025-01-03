import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

type ConfigType = {
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: '$2b$10$test',
    fullName: 'Test User',
    emailVerified: null,
    emailVerificationToken: 'verification-token',
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    passwordResetToken: null,
    passwordResetExpires: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockUser),
            login: jest.fn().mockResolvedValue({
              user: mockUser,
              accessToken: 'accessToken',
              refreshToken: 'refreshToken',
            }),
            verifyEmail: jest.fn().mockResolvedValue(undefined),
            checkUsername: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: keyof ConfigType) => {
              const config: ConfigType = {
                JWT_SECRET: 'test-secret',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_EXPIRATION: '15m',
                JWT_REFRESH_EXPIRATION: '7d',
              };
              return config[key];
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      fullName: 'Test User',
    };

    it('should register a new user', async () => {
      const result = await controller.register(registerDto);
      expect(result).toEqual(mockUser);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      const result = await controller.login(loginDto);
      expect(result).toEqual({
        user: mockUser,
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('verifyEmail', () => {
    const token = 'verification-token';

    it('should verify email successfully', async () => {
      await controller.verifyEmail({ token });
      expect(service.verifyEmail).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException if verification fails', async () => {
      jest.spyOn(service, 'verifyEmail').mockRejectedValue(new UnauthorizedException());
      
      await expect(controller.verifyEmail({ token })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('checkUsername', () => {
    it('should return availability status for username', async () => {
      jest.spyOn(service, 'checkUsername').mockResolvedValue(true);
      const result = await controller.checkUsername('testuser');
      expect(result).toEqual({ isAvailable: true });
      expect(service.checkUsername).toHaveBeenCalledWith('testuser');
    });

    it('should return false for unavailable username', async () => {
      jest.spyOn(service, 'checkUsername').mockResolvedValue(false);
      const result = await controller.checkUsername('admin');
      expect(result).toEqual({ isAvailable: false });
      expect(service.checkUsername).toHaveBeenCalledWith('admin');
    });
  });
}); 