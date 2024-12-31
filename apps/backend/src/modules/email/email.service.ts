import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

interface MailOptions {
  from?: string;
  to: string;
  subject: string;
  html?: string;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(private configService: ConfigService) {
    const emailHost = this.configService.get('EMAIL_HOST');
    
    // Register Handlebars helpers
    handlebars.registerHelper('raw', function(context) {
      return new handlebars.SafeString(context);
    });

    if (emailHost && emailHost !== 'smtp.example.com') {
      // Production/Staging SMTP Configuration
      this.transporter = nodemailer.createTransport({
        host: emailHost,
        port: Number(this.configService.get('EMAIL_PORT', 587)),
        secure: this.configService.get('EMAIL_SECURE') === 'true',
        auth: {
          user: this.configService.get('EMAIL_USER'),
          pass: this.configService.get('EMAIL_PASS'),
        },
      });
    } else {
      // Local development fallback
      this.transporter = {
        sendMail: async (mailOptions: MailOptions) => {
          this.logger.log('🚀 Development Email (Not Sent)');
          this.logger.log(`To: ${mailOptions.to}`);
          this.logger.log(`Subject: ${mailOptions.subject}`);
          this.logger.log(`Body: ${mailOptions.html}`);
          return Promise.resolve(true);
        }
      } as any;
    }
  }

  private loadTemplate(templateName: string, context: Record<string, any>): string {
    try {
      // Try multiple potential paths
      const possiblePaths = [
        path.join(__dirname, 'templates', `${templateName}.hbs`),
        path.join(process.cwd(), 'src', 'modules', 'email', 'templates', `${templateName}.hbs`),
        path.join(process.cwd(), 'dist', 'src', 'modules', 'email', 'templates', `${templateName}.hbs`),
      ];

      this.logger.log('Searching for template in paths:');
      possiblePaths.forEach(p => this.logger.log(p));

      let templateSource: string | undefined;
      let templatePath: string | undefined;
      for (const path of possiblePaths) {
        if (fs.existsSync(path)) {
          templateSource = fs.readFileSync(path, 'utf8');
          templatePath = path;
          break;
        }
      }

      if (!templateSource) {
        throw new Error(`Template ${templateName}.hbs not found in any of the expected locations`);
      }

      this.logger.log(`Found template at: ${templatePath}`);
      this.logger.log(`Template source: \n${templateSource}`);

      const template = handlebars.compile(templateSource);
      const renderedTemplate = template(context);

      this.logger.log(`Rendered template: \n${renderedTemplate}`);

      return renderedTemplate;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error loading email template: ${errorMessage}`);
      
      // More detailed fallback template
      return `
        <h1>Email Template Error</h1>
        <p>Template Name: ${templateName}</p>
        <p>Error: ${errorMessage}</p>
        <p>Context: ${JSON.stringify(context, null, 2)}</p>
      `;
    }
  }

  async sendVerificationEmail(user: User, verificationToken: string): Promise<void> {
    // Construct verification link with correct path and use raw token
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/auth/verify-email?token=${verificationToken}`;
    
    const emailContext = {
      userName: user.fullName || 'User',
      verificationLink,
      supportEmail: this.configService.get('SUPPORT_EMAIL'),
    };

    const emailHtml = this.loadTemplate('verification', emailContext);

    // Log the verification link for debugging
    this.logger.log(`Verification Link: ${verificationLink}`);

    await this.transporter.sendMail({
      from: `"Consultation Platform" <${this.configService.get('EMAIL_FROM')}>`,
      to: user.email,
      subject: 'Verify Your Email - Consultation Platform',
      html: emailHtml,
    });
  }

  async sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
    const resetLink = `${this.configService.get('FRONTEND_URL')}/auth/reset-password?token=${resetToken}`;
    
    const emailContext = {
      userName: user.fullName || 'User',
      resetLink,
      supportEmail: this.configService.get('SUPPORT_EMAIL'),
    };

    const emailHtml = this.loadTemplate('password-reset', emailContext);

    await this.transporter.sendMail({
      from: `"Consultation Platform" <${this.configService.get('EMAIL_FROM')}>`,
      to: user.email,
      subject: 'Password Reset - Consultation Platform',
      html: emailHtml,
    });
  }
} 