import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UserType } from '@prisma/client';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.session.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      userType: UserType.CLIENT,
    };

    let verificationToken: string;
    let accessToken: string;
    let refreshToken: string;

    // Clean up before starting the test suite
    beforeAll(async () => {
      await prisma.session.deleteMany();
      await prisma.availability.deleteMany();
      await prisma.profile.deleteMany();
      await prisma.user.deleteMany();
    });

    it('should register a new user and not allow login before verification', async () => {
      // Register user
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Get user and verification token
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      expect(user).toBeDefined();
      expect(user?.emailVerified).toBeNull();
      expect(user?.emailVerificationToken).toBeDefined();
      verificationToken = user!.emailVerificationToken!;

      // Try to login before verification
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.message).toBe('Please verify your email before logging in');
        });
    });

    it('should verify email and allow login', async () => {
      // Verify email
      await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: verificationToken })
        .expect(201);

      // Check if user is verified
      const verifiedUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      expect(verifiedUser).toBeDefined();
      expect(verifiedUser?.emailVerified).toBeDefined();
      expect(verifiedUser?.emailVerificationToken).toBeNull();

      // Login after verification
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('accessToken');
      expect(loginResponse.body).toHaveProperty('refreshToken');
      expect(loginResponse.body.user).toHaveProperty('email', testUser.email);

      accessToken = loginResponse.body.accessToken;
      refreshToken = loginResponse.body.refreshToken;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUser.email);
    });

    it('should refresh tokens', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh')
        .send({ refreshToken })
        .expect(201);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.accessToken).not.toBe(accessToken);
      expect(response.body.refreshToken).not.toBe(refreshToken);

      // Update tokens for subsequent tests
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('should handle password reset flow', async () => {
      // Request password reset
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(201);

      // Get reset token
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeDefined();
      const resetToken = user!.passwordResetToken!;

      // Reset password
      const newPassword = 'newPassword123';
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .query({ token: resetToken })
        .send({ password: newPassword })
        .expect(201);

      // Old password should not work
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(401);

      // New password should work
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(201);
    });
  });
}); 