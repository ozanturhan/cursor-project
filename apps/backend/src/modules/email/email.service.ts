import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendVerificationEmail(user: User): Promise<void> {
    // TODO: Implement actual email sending
    console.log(`Sending verification email to ${user.email}`);
  }

  async sendPasswordResetEmail(user: User, token: string): Promise<void> {
    // TODO: Implement actual email sending
    console.log(`Sending password reset email to ${user.email} with token ${token}`);
  }
} 