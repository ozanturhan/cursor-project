import { PrismaClient, Role, BookingStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clean up existing data
  await prisma.availability.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();

  // Create professional users
  const professional1 = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      fullName: 'John Doe',
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      roles: {
        create: [
          { role: Role.PROFESSIONAL },
          { role: Role.CLIENT }
        ]
      },
      profiles: {
        create: {
          profession: 'Senior Software Engineer',
          bio: 'Experienced software engineer with 10+ years in web development',
          hourlyRate: 150,
          availabilities: {
            create: [
              {
                dayOfWeek: 1, // Monday
                startHour: 9,
                startMinute: 0,
                endHour: 17,
                endMinute: 0,
              },
              {
                dayOfWeek: 2, // Tuesday
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
      roles: true,
      profiles: {
        include: {
          availabilities: true,
        },
      },
    },
  });

  const professional2 = await prisma.user.create({
    data: {
      email: 'jane.smith@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      fullName: 'Jane Smith',
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      roles: {
        create: [
          { role: Role.PROFESSIONAL },
          { role: Role.CLIENT }
        ]
      },
      profiles: {
        create: {
          profession: 'Business Consultant',
          bio: 'Strategic business consultant with expertise in growth and operations',
          hourlyRate: 200,
          availabilities: {
            create: [
              {
                dayOfWeek: 3, // Wednesday
                startHour: 10,
                startMinute: 0,
                endHour: 18,
                endMinute: 0,
              },
              {
                dayOfWeek: 4, // Thursday
                startHour: 10,
                startMinute: 0,
                endHour: 18,
                endMinute: 0,
              },
            ],
          },
        },
      },
    },
    include: {
      roles: true,
      profiles: {
        include: {
          availabilities: true,
        },
      },
    },
  });

  // Create client users
  const client1 = await prisma.user.create({
    data: {
      email: 'client1@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      fullName: 'Alice Johnson',
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      roles: {
        create: { role: Role.CLIENT }
      }
    },
    include: {
      roles: true
    }
  });

  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      fullName: 'Bob Wilson',
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      roles: {
        create: { role: Role.CLIENT }
      }
    },
    include: {
      roles: true
    }
  });

  console.log('Seed data created successfully');
  console.log('Professional users:', { professional1, professional2 });
  console.log('Client users:', { client1, client2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 