import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

describe('ProfileController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);

    // Clean up database
    await prisma.user.deleteMany({});

    // Create test user
    await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        passwordHash: await bcrypt.hash('password123', 10),
        fullName: 'Test User',
        emailVerified: new Date(),
      },
    });

    await app.init();
  });

  afterEach(async () => {
    // Clean up database
    await prisma.user.deleteMany({});
    await app.close();
  });

  it('/profile/:username (GET)', () => {
    return request(app.getHttpServer())
      .get('/profile/testuser')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('username', 'testuser');
        expect(res.body).toHaveProperty('fullName', 'Test User');
      });
  });
}); 