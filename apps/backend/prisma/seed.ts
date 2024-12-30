import { PrismaClient, UserType, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create test password hash
  const testPassword = await bcrypt.hash('test123', 10);

  // Create professionals
  const therapist = await prisma.user.create({
    data: {
      email: 'therapist@example.com',
      passwordHash: testPassword,
      fullName: 'Dr. Jane Smith',
      userType: UserType.PROFESSIONAL,
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      profile: {
        create: {
          profession: 'Therapist',
          bio: 'Licensed therapist with 10 years of experience in cognitive behavioral therapy.',
          hourlyRate: 120.00,
          availability: {
            create: [
              // Monday availability
              {
                dayOfWeek: 1,
                startHour: 9,
                startMinute: 0,
                endHour: 17,
                endMinute: 0,
              },
              // Wednesday availability
              {
                dayOfWeek: 3,
                startHour: 9,
                startMinute: 0,
                endHour: 17,
                endMinute: 0,
              },
            ],
          },
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const coach = await prisma.user.create({
    data: {
      email: 'coach@example.com',
      passwordHash: testPassword,
      fullName: 'John Coach',
      userType: UserType.PROFESSIONAL,
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      profile: {
        create: {
          profession: 'Career Coach',
          bio: 'Certified career coach specializing in tech industry transitions.',
          hourlyRate: 90.00,
          availability: {
            create: {
              dayOfWeek: 2,
              startHour: 10,
              startMinute: 0,
              endHour: 18,
              endMinute: 0,
            },
          },
        },
      },
    },
  });

  // Create clients
  const client1 = await prisma.user.create({
    data: {
      email: 'client1@example.com',
      passwordHash: testPassword,
      fullName: 'Alice Johnson',
      userType: UserType.CLIENT,
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      passwordHash: testPassword,
      fullName: 'Bob Wilson',
      userType: UserType.CLIENT,
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  // Create sample sessions for testing
  await prisma.session.create({
    data: {
      userId: therapist.id,
      token: 'sample-session-token-1',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    },
  });

  await prisma.session.create({
    data: {
      userId: client1.id,
      token: 'sample-session-token-2',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // Create bookings
  await prisma.booking.createMany({
    data: [
      {
        clientId: client1.id,
        professionalId: therapist.id,
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        status: BookingStatus.CONFIRMED,
      },
      {
        clientId: client2.id,
        professionalId: therapist.id,
        startTime: new Date('2024-01-15T14:00:00Z'),
        endTime: new Date('2024-01-15T15:00:00Z'),
        status: BookingStatus.PENDING,
      },
      {
        clientId: client1.id,
        professionalId: coach.id,
        startTime: new Date('2024-01-16T11:00:00Z'),
        endTime: new Date('2024-01-16T12:00:00Z'),
        status: BookingStatus.CONFIRMED,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 