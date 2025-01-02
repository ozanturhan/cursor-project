import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@prisma/client';

describe('ProfileController (e2e)', () => {
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
      role: Role.CLIENT,
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
      await prisma.userRole.deleteMany({});
      await prisma.profile.deleteMany({});
      await prisma.user.deleteMany({});
      testUserIndex = 0;
    } catch (error) {
      console.error('Error cleaning up database:', error);
    }
  });

  afterAll(async () => {
    try {
      await prisma.userRole.deleteMany({});
      await prisma.profile.deleteMany({});
      await prisma.user.deleteMany({});
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error in afterAll cleanup:', error);
    } finally {
      await app.close();
    }
  });

  describe('Profile Management', () => {
    let accessToken: string;
    let testUser: ReturnType<typeof createTestUser>;

    beforeEach(async () => {
      testUser = createTestUser();

      // Register and verify user
      const registerResponse = await request(app.getHttpServer())
        .post('/auth/register')
        .send(testUser)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });

      // Verify email
      await prisma.user.update({
        where: { id: user!.id },
        data: {
          emailVerified: new Date(),
          emailVerificationToken: null,
        },
      });

      // Login to get access token
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201);

      accessToken = loginResponse.body.accessToken;
    });

    it('should create and retrieve profile', async () => {
      // Create profile
      const profileData = {
        bio: 'Test bio',
        title: 'Software Engineer',
        location: 'Test City',
        profession: 'Developer',
        hourlyRate: 100,
      };

      const createResponse = await request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(profileData)
        .expect(200);

      expect(createResponse.body).toMatchObject(profileData);

      // Get profile
      const getResponse = await request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(getResponse.body).toMatchObject(profileData);
    });

    it('should update profile', async () => {
      // Create initial profile
      const initialProfile = {
        bio: 'Initial bio',
        title: 'Initial title',
      };

      await request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(initialProfile)
        .expect(200);

      // Update profile
      const updateData = {
        bio: 'Updated bio',
        title: 'Updated title',
      };

      const response = await request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.bio).toBe(updateData.bio);
      expect(response.body.title).toBe(updateData.title);
    });
  });
}); 