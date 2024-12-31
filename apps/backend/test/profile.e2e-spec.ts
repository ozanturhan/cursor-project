import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthService } from '../src/modules/auth/auth.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);

    await app.init();

    // Create test user with proper password hash
    const password = 'password123';
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email: 'profile-test@example.com',
        passwordHash,
        fullName: 'Test User',
        emailVerified: new Date(),
        roles: {
          create: {
            role: Role.PROFESSIONAL,
          },
        },
      },
    });

    userId = user.id;
    const auth = await authService.login({
      email: 'profile-test@example.com',
      password: password,
    });
    accessToken = auth.accessToken;
  });

  afterAll(async () => {
    // Clean up in correct order (respect foreign key constraints)
    await prisma.availability.deleteMany({
      where: { profile: { userId } },
    });
    await prisma.socialLink.deleteMany({
      where: { profile: { userId } },
    });
    await prisma.profile.deleteMany({
      where: { userId },
    });
    await prisma.userRole.deleteMany({
      where: { userId },
    });
    await prisma.user.delete({
      where: { id: userId },
    });
    await prisma.$disconnect();
    await app.close();
  });

  describe('/profile (GET)', () => {
    it('should get empty profile initially', () => {
      return request(app.getHttpServer())
        .get('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({});
        });
    });
  });

  describe('/profile (PUT)', () => {
    it('should create profile', async () => {
      const response = await request(app.getHttpServer())
        .put('/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          bio: 'Test bio',
          title: 'Software Engineer',
          location: 'Berlin',
        })
        .expect(200);

      expect(response.body.bio).toBe('Test bio');
      expect(response.body.title).toBe('Software Engineer');
      expect(response.body.location).toBe('Berlin');
      return response;
    });
  });

  describe('/profile/social-links', () => {
    let socialLinkId: string;

    it('should add social link', async () => {
      const response = await request(app.getHttpServer())
        .post('/profile/social-links')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          platform: 'GITHUB',
          url: 'https://github.com/testuser',
        })
        .expect(201);

      expect(response.body.platform).toBe('GITHUB');
      expect(response.body.url).toBe('https://github.com/testuser');
      socialLinkId = response.body.id;
      return response;
    });

    it('should delete social link', async () => {
      return request(app.getHttpServer())
        .delete(`/profile/social-links/${socialLinkId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('/profile/availability', () => {
    let availabilityId: string;

    it('should add availability slot', async () => {
      const response = await request(app.getHttpServer())
        .post('/profile/availability')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          dayOfWeek: 1,
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
        })
        .expect(201);

      expect(response.body.dayOfWeek).toBe(1);
      expect(response.body.startHour).toBe(9);
      expect(response.body.endHour).toBe(17);
      availabilityId = response.body.id;
      return response;
    });

    it('should delete availability slot', async () => {
      return request(app.getHttpServer())
        .delete(`/profile/availability/${availabilityId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });
  });

  describe('/profile/:userId (GET)', () => {
    it('should get public profile', async () => {
      // Create a new social link and availability slot for testing
      await request(app.getHttpServer())
        .post('/profile/social-links')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          platform: 'GITHUB',
          url: 'https://github.com/testuser',
        });

      await request(app.getHttpServer())
        .post('/profile/availability')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          dayOfWeek: 1,
          startHour: 9,
          startMinute: 0,
          endHour: 17,
          endMinute: 0,
        });

      const response = await request(app.getHttpServer())
        .get(`/profile/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.bio).toBe('Test bio');
      expect(response.body.title).toBe('Software Engineer');
      expect(response.body.location).toBe('Berlin');
      expect(response.body.socialLinks).toHaveLength(1);
      expect(response.body.availabilities).toHaveLength(1);
      expect(response.body.user.email).toBe('profile-test@example.com');
      return response;
    });
  });
}); 