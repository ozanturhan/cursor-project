import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let emailService: EmailService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    passwordHash: 'hashedPassword',
    fullName: 'Test User',
    emailVerified: null,
    emailVerificationToken: 'valid-token',
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockEmailService = {
    sendVerificationEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      fullName: 'Test User',
    };

    it('should register a new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);
      mockEmailService.sendVerificationEmail.mockResolvedValue(undefined);

      const result = await service.register(registerData);

      expect(result).toBe(mockUser);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: registerData.email,
            username: registerData.username,
            fullName: registerData.fullName,
          }),
        }),
      );
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerData)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if username exists', async () => {
      mockPrismaService.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      await expect(service.register(registerData)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    beforeEach(() => {
      mockJwtService.signAsync.mockResolvedValue('token');
    });

    it('should login successfully', async () => {
      const mockVerifiedUser = {
        ...mockUser,
        emailVerified: new Date(),
      };
      mockPrismaService.user.findUnique.mockResolvedValue(mockVerifiedUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.login(loginData);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      await expect(service.login(loginData)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        emailVerified: new Date(),
        emailVerificationToken: null,
      });

      await service.verifyEmail('valid-token');

      const call = mockPrismaService.user.findFirst.mock.calls[0][0];
      expect(call.where.emailVerificationToken).toBe('valid-token');
      expect(call.where.emailVerificationExpires.gt).toBeInstanceOf(Date);
      expect(call.where.emailVerified).toBeNull();

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: {
          emailVerified: expect.any(Date),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    });

    it('should throw BadRequestException if token is invalid', async () => {
      mockPrismaService.user.findFirst.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(
        'Invalid or expired verification token'
      );
    });
  });
}); 