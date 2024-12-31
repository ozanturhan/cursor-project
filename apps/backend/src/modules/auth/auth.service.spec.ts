import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let emailService: EmailService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: '$2b$10$test',
    fullName: 'Test User',
    roles: [{ id: '1', userId: '1', role: Role.CLIENT, createdAt: new Date(), updatedAt: new Date() }],
    emailVerified: new Date(),
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
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
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
            sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    };

    it('should register a new user and send verification email', async () => {
      const userWithToken = {
        ...mockUser,
        emailVerificationToken: 'verification-token',
      };
      
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(userWithToken);

      const result = await service.register(registerDto);

      expect(result).toEqual(userWithToken);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: 'hashedPassword',
          fullName: registerDto.fullName,
          emailVerificationToken: expect.any(String),
          emailVerificationExpires: expect.any(Date),
          roles: {
            create: {
              role: Role.CLIENT,
            },
          },
        },
        include: {
          roles: true,
        },
      });
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          fullName: registerDto.fullName,
        }),
        expect.any(String),
      );
    });

    it('should throw ConflictException if email exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should handle email sending error during registration', async () => {
      const userWithToken = {
        ...mockUser,
        emailVerificationToken: 'verification-token',
      };
      
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prisma.user, 'create').mockResolvedValue(userWithToken);
      jest.spyOn(emailService, 'sendVerificationEmail').mockRejectedValue(new Error('Email sending failed'));

      const result = await service.register(registerDto);

      expect(result).toEqual(userWithToken);
      expect(emailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: registerDto.email,
          fullName: registerDto.fullName,
        }),
        expect.any(String),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'token',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
      const unverifiedUser = { ...mockUser, emailVerified: null };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(unverifiedUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyEmail', () => {
    const verificationToken = 'valid-token';

    it('should verify email successfully', async () => {
      const unverifiedUser = {
        ...mockUser,
        emailVerified: null,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(unverifiedUser);
      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        ...unverifiedUser,
        emailVerified: expect.any(Date),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      });

      await service.verifyEmail(verificationToken);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: unverifiedUser.id },
        data: {
          emailVerified: expect.any(Date),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    });

    it('should throw BadRequestException if token is invalid', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);

      await expect(service.verifyEmail(verificationToken)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if token is expired', async () => {
      const expiredUser = {
        ...mockUser,
        emailVerified: null,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: new Date(Date.now() - 24 * 60 * 60 * 1000),
      };

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(expiredUser);
      jest.spyOn(prisma.user, 'update').mockRejectedValue(new BadRequestException());

      await expect(service.verifyEmail(verificationToken)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
}); 