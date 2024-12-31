import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@prisma/client';

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
    // Clean up in correct order (respect foreign key constraints)
    await prisma.availability.deleteMany();
    await prisma.socialLink.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  beforeAll(async () => {
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
  });

  describe('Authentication Flow', () => {
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    };

    let verificationToken: string;
    let accessToken: string;
    let refreshToken: string;

    // Clean up before starting the test suite
    beforeAll(async () => {
      await prisma.user.deleteMany();
    });

    it('should register a new user and not allow login before verification', async () => {
      // Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Get user and verification token
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
        include: { roles: true },
      });

      expect(user).toBeDefined();
      expect(user?.emailVerified).toBeNull();
      expect(user?.emailVerificationToken).toBeDefined();
      expect(user?.roles).toHaveLength(1);
      expect(user?.roles[0].role).toBe(Role.CLIENT);
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
          expect(res.body.message).toBe('Please verify your email first');
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
        include: { roles: true },
      });

      expect(verifiedUser).toBeDefined();
      expect(verifiedUser?.emailVerified).toBeDefined();
      expect(verifiedUser?.emailVerificationToken).toBeNull();
      expect(verifiedUser?.roles).toHaveLength(1);
      expect(verifiedUser?.roles[0].role).toBe(Role.CLIENT);

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
      expect(loginResponse.body.user.roles).toHaveLength(1);
      expect(loginResponse.body.user.roles[0].role).toBe(Role.CLIENT);

      accessToken = loginResponse.body.accessToken;
      refreshToken = loginResponse.body.refreshToken;
    });

    it('should access protected route with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUser.email);
      expect(response.body.roles).toHaveLength(1);
      expect(response.body.roles[0].role).toBe(Role.CLIENT);
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
      expect(response.body.user.roles).toHaveLength(1);
      expect(response.body.user.roles[0].role).toBe(Role.CLIENT);

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
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        })
        .expect(201);

      expect(loginResponse.body.user.roles).toHaveLength(1);
      expect(loginResponse.body.user.roles[0].role).toBe(Role.CLIENT);
    });
  });
}); 