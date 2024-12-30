import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserType } from '@prisma/client';
import * as argon2 from 'argon2';

jest.mock('argon2');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      userType: UserType.CLIENT,
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword';
      mockPrisma.user.findUnique.mockResolvedValue(null);
      (argon2.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue({ id: '1', ...registerDto });

      await service.register(registerDto);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(argon2.hash).toHaveBeenCalledWith(registerDto.password);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      passwordHash: 'hashedPassword',
      emailVerified: new Date(),
      fullName: 'Test User',
      userType: UserType.CLIENT,
    };

    it('should login successfully with valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce('accessToken');
      mockJwtService.signAsync.mockResolvedValueOnce('refreshToken');
      mockPrisma.session.create.mockResolvedValue({ id: '1' });

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        userType: mockUser.userType,
      });
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
      const unverifiedUser = { ...mockUser, emailVerified: null };
      mockPrisma.user.findUnique.mockResolvedValue(unverifiedUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Please verify your email before logging in'),
      );
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    const mockSession = {
      id: '1',
      token: 'validRefreshToken',
      user: {
        id: '1',
        email: 'test@example.com',
        fullName: 'Test User',
        userType: UserType.CLIENT,
      },
    };

    it('should refresh tokens successfully', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: '1',
        type: 'refresh',
      });
      mockPrisma.session.findFirst.mockResolvedValue(mockSession);
      
      // Mock token generation with different values each time
      let tokenCount = 0;
      mockJwtService.signAsync.mockImplementation(() => {
        tokenCount++;
        return Promise.resolve(`token${tokenCount}`);
      });
      
      mockPrisma.session.update.mockResolvedValue({ id: '1' });

      const result = await service.refreshToken('validRefreshToken');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(mockPrisma.session.update).toHaveBeenCalled();
      expect(result.accessToken).not.toBe('validRefreshToken');
    });

    it('should throw UnauthorizedException with invalid refresh token', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(service.refreshToken('invalidToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException with wrong token type', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: '1',
        type: 'access',
      });

      await expect(service.refreshToken('wrongTypeToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyEmail', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
    };

    it('should verify email successfully', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(mockUser);
      mockPrisma.user.update.mockResolvedValue({ ...mockUser, emailVerified: new Date() });

      await service.verifyEmail('validToken');

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          emailVerified: expect.any(Date),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    });

    it('should throw BadRequestException with invalid token', async () => {
      mockPrisma.user.findFirst.mockResolvedValue(null);

      await expect(service.verifyEmail('invalidToken')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
}); 