import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let testUserIndex = 0;

  const createTestUser = () => {
    testUserIndex++;
    return {
      email: `test${Date.now()}${testUserIndex}@example.com`,
      password: 'Password123!',
      username: `testuser${Date.now()}${testUserIndex}`,
      fullName: `Test User ${testUserIndex}`,
    };
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    // Clean up database before each test
    try {
      console.log('Cleaning up database before test...');
      await prisma.profile.deleteMany({});
      await prisma.user.deleteMany({});
      testUserIndex = 0;
      console.log('Database cleanup complete');
    } catch (error) {
      console.error('Error cleaning up database:', error);
    }
  });

  afterAll(async () => {
    try {
      await prisma.profile.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    } finally {
      await app.close();
    }
  });

  describe('Authentication Flow', () => {
    it('should register a new user and not allow login before verification', async () => {
      const testUser = createTestUser();
      
      // Register user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('email', testUser.email);
      expect(registerResponse.body).toHaveProperty('username', testUser.username);
      expect(registerResponse.body).toHaveProperty('fullName', testUser.fullName);

      // Add a small delay to ensure database operations complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get user and verification token
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      console.log('Test user data:', testUser);
      console.log('Register response:', registerResponse.body);
      console.log('Found user:', user);
      expect(user).toBeDefined();
      expect(user!.emailVerificationToken).toBeDefined();

      // Try to login before verification
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(401);
    });

    it('should verify email and allow login', async () => {
      const testUser = createTestUser();
      
      // Register user first
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Get verification token and ensure expiry is set
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(user).toBeDefined();
      const verificationToken = user!.emailVerificationToken!;

      // Set verification expiry
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        },
      });

      // Verify email
      await request(app.getHttpServer())
        .post('/auth/verify-email')
        .send({ token: verificationToken })
        .expect(201);

      // Check if user is verified
      const verifiedUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(verifiedUser!.emailVerified).toBeDefined();
      expect(verifiedUser!.emailVerificationToken).toBeNull();

      // Login with verified account
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      expect(loginResponse.body).toHaveProperty('accessToken');
      expect(loginResponse.body).toHaveProperty('refreshToken');
    });

    it('should access protected route with valid token', async () => {
      const testUser = createTestUser();
      
      // Register and verify user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
        },
      });

      // Login to get tokens
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      const { accessToken } = loginResponse.body;

      // Access protected route
      const response = await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('email', testUser.email);
    });

    it('should handle password reset flow', async () => {
      const testUser = createTestUser();
      
      // Register and verify user first
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      // Verify the user
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
        },
      });

      // Request password reset
      await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(201);

      // Get reset token
      const updatedUser = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      expect(updatedUser).toBeDefined();
      const resetToken = updatedUser!.passwordResetToken!;

      // Reset password
      const newPassword = 'NewPassword123!';
      await request(app.getHttpServer())
        .post('/auth/reset-password')
        .query({ token: resetToken })
        .send({ password: newPassword })
        .expect(201);

      // Login with new password
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