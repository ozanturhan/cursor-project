import { PrismaClient, UserType, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.profile.deleteMany();
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
                startTime: new Date('2024-01-01T09:00:00Z'),
                endTime: new Date('2024-01-01T17:00:00Z'),
              },
              // Wednesday availability
              {
                dayOfWeek: 3,
                startTime: new Date('2024-01-01T09:00:00Z'),
                endTime: new Date('2024-01-01T17:00:00Z'),
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
      profile: {
        create: {
          profession: 'Career Coach',
          bio: 'Certified career coach specializing in tech industry transitions.',
          hourlyRate: 90.00,
          availability: {
            create: [
              // Tuesday availability
              {
                dayOfWeek: 2,
                startTime: new Date('2024-01-01T10:00:00Z'),
                endTime: new Date('2024-01-01T18:00:00Z'),
              },
              // Thursday availability
              {
                dayOfWeek: 4,
                startTime: new Date('2024-01-01T10:00:00Z'),
                endTime: new Date('2024-01-01T18:00:00Z'),
              },
            ],
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
    },
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      passwordHash: testPassword,
      fullName: 'Bob Wilson',
      userType: UserType.CLIENT,
      emailVerified: new Date(),
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