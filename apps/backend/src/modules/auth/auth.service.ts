import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await argon2.hash(dto.password);

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        fullName: dto.fullName,
        userType: dto.userType,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        profile: dto.userType === UserType.PROFESSIONAL ? {
          create: {
            profession: dto.profession || '',
          },
        } : undefined,
      },
    });

    // TODO: Send verification email
    await this.sendVerificationEmail(user.email, verificationToken);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.passwordHash, dto.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Create session
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
      },
      ...tokens,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
        emailVerified: null, // Only verify if not already verified
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
          emailVerificationExpires: null,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to verify email. Please try again.');
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    const resetToken = randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    // TODO: Send password reset email
    await this.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    // Invalidate all sessions
    await this.prisma.session.deleteMany({
      where: { userId: user.id },
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      // Verify the refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if the token exists in the session
      const session = await this.prisma.session.findFirst({
        where: {
          token: refreshToken,
          expiresAt: {
            gt: new Date(),
          },
        },
        include: {
          user: true,
        },
      });

      if (!session) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(session.user);

      // Update session with new refresh token
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          token: tokens.refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      return {
        user: {
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.fullName,
          userType: session.user.userType,
        },
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: { id: string; email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: 'access',
          iat: Date.now(),
        },
        {
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          type: 'refresh',
          iat: Date.now(),
        },
        {
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async sendVerificationEmail(email: string, token: string): Promise<void> {
    // TODO: Implement email sending
    console.log(`Verification email to ${email} with token ${token}`);
  }

  private async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // TODO: Implement email sending
    console.log(`Password reset email to ${email} with token ${token}`);
  }
} 