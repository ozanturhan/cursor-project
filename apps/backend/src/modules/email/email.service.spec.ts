import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

jest.mock('nodemailer');
jest.mock('fs');
jest.mock('path');

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    passwordHash: 'hash',
    fullName: 'Test User',
    emailVerified: null,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  const mockConfigService = {
    get: jest.fn((key: string): string | undefined => {
      const config: Record<string, string> = {
        EMAIL_HOST: 'smtp.example.com',
        EMAIL_PORT: '587',
        EMAIL_SECURE: 'false',
        EMAIL_USER: 'user',
        EMAIL_PASS: 'pass',
        EMAIL_FROM: 'noreply@example.com',
        FRONTEND_URL: 'http://localhost:3000',
        SUPPORT_EMAIL: 'support@example.com',
      };
      return config[key];
    }),
  } as unknown as ConfigService;

  beforeEach(async () => {
    jest.clearAllMocks();
    
    // Mock fs.existsSync and fs.readFileSync
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation((filePath: string) => {
      if (filePath.includes('verification')) {
        return 'Hello {{fullName}}, Please verify your email by clicking this link: {{{verificationLink}}}. If you need help, contact us at {{supportEmail}}';
      } else if (filePath.includes('password-reset')) {
        return 'Hello {{fullName}}, Click this link to reset your password: {{{resetLink}}}. If you need help, contact us at {{supportEmail}}';
      }
      return '';
    });
    
    // Mock path.join to return a simple path
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should create development transporter when EMAIL_HOST is smtp.example.com', () => {
      expect(nodemailer.createTransport).not.toHaveBeenCalled();
    });

    it('should create production transporter when EMAIL_HOST is set', () => {
      const prodConfigService = {
        get: jest.fn((key: string): string | undefined => {
          const config: Record<string, string> = {
            EMAIL_HOST: 'smtp.gmail.com',
            EMAIL_PORT: '587',
            EMAIL_SECURE: 'false',
            EMAIL_USER: 'user',
            EMAIL_PASS: 'pass',
          };
          return config[key];
        }),
      } as unknown as ConfigService;

      new EmailService(prodConfigService);

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'user',
          pass: 'pass',
        },
      });
    });
  });

  describe('sendVerificationEmail', () => {
    const verificationToken = 'test-token';

    it('should send verification email with correct data', async () => {
      const sendMailMock = jest.fn().mockResolvedValue(true);
      (service as any).transporter = { sendMail: sendMailMock };

      await service.sendVerificationEmail(mockUser, verificationToken);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Consultation Platform" <noreply@example.com>',
        to: mockUser.email,
        subject: 'Verify Your Email - Consultation Platform',
        html: expect.stringContaining('Please verify your email'),
      });
    });

    it('should construct correct verification link', async () => {
      const sendMailMock = jest.fn().mockResolvedValue(true);
      (service as any).transporter = { sendMail: sendMailMock };

      await service.sendVerificationEmail(mockUser, verificationToken);

      const expectedLink = 'http://localhost:3000/auth/verify-email?token=test-token';
      const emailHtml = sendMailMock.mock.calls[0][0].html;
      expect(emailHtml).toContain(expectedLink);
      expect(emailHtml).not.toContain('&#x3D;');
    });

    it('should handle email sending error', async () => {
      const sendMailMock = jest.fn().mockRejectedValue(new Error('Failed to send'));
      (service as any).transporter = { sendMail: sendMailMock };

      await expect(service.sendVerificationEmail(mockUser, verificationToken))
        .rejects.toThrow('Failed to send');
    });
  });

  describe('sendPasswordResetEmail', () => {
    const resetToken = 'reset-token';

    it('should send password reset email with correct data', async () => {
      const sendMailMock = jest.fn().mockResolvedValue(true);
      (service as any).transporter = { sendMail: sendMailMock };

      await service.sendPasswordResetEmail(mockUser, resetToken);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Consultation Platform" <noreply@example.com>',
        to: mockUser.email,
        subject: 'Password Reset - Consultation Platform',
        html: expect.stringContaining('Click this link to reset your password'),
      });
    });

    it('should construct correct reset link', async () => {
      const sendMailMock = jest.fn().mockResolvedValue(true);
      (service as any).transporter = { sendMail: sendMailMock };

      await service.sendPasswordResetEmail(mockUser, resetToken);

      const expectedLink = 'http://localhost:3000/auth/reset-password?token=reset-token';
      const emailHtml = sendMailMock.mock.calls[0][0].html;
      expect(emailHtml).toContain(expectedLink);
      expect(emailHtml).not.toContain('&#x3D;');
    });

    it('should handle email sending error', async () => {
      const sendMailMock = jest.fn().mockRejectedValue(new Error('Failed to send'));
      (service as any).transporter = { sendMail: sendMailMock };

      await expect(service.sendPasswordResetEmail(mockUser, resetToken))
        .rejects.toThrow('Failed to send');
    });
  });
}); 