import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto, LoginDto, AuthResponse } from './dto/auth.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register(data: RegisterDto): Promise<User> {
    // Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    // Check if username exists
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10);

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        fullName: data.fullName,
        emailVerificationToken: verificationToken,
      },
    });

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(user, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue with registration even if email sending fails
    }

    return user;
  }

  async login(data: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const tokens = await this.generateTokens(user);
    return {
      user,
      ...tokens,
    };
  }

  async verifyEmail(token: string): Promise<void> {
    console.log('Attempting to verify email with token:', token);

    const user = await this.prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
        emailVerified: null,
      },
    });

    console.log('User found during verification:', user ? user.id : 'No user found');

    if (!user) {
      console.error('Invalid or expired verification token:', token);
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
    });

    console.log('Email verified successfully for user:', user.id);
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

    // Send password reset email
    await this.emailService.sendPasswordResetEmail(user, resetToken);
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      return {
        user,
        ...tokens,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { 
          sub: user.id, 
          email: user.email,
          username: user.username,
          jti: randomBytes(16).toString('hex')
        },
        { expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { 
          sub: user.id, 
          email: user.email,
          username: user.username,
          jti: randomBytes(16).toString('hex')
        },
        { expiresIn: '7d' },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async checkUsername(username: string): Promise<boolean> {
    // Check if username is reserved
    const reservedUsernames = ['admin', 'administrator', 'system', 'support'];
    if (reservedUsernames.includes(username.toLowerCase())) {
      return false;
    }

    // Check if username exists
    const existingUser = await this.prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    return !existingUser;
  }
} 