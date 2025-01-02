import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        passwordHash: await bcrypt.hash('admin123', 10),
        fullName: 'Admin User',
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        roles: {
          create: {
            role: Role.PROFESSIONAL,
          },
        },
      },
    });

    // Create professional user
    const professionalUser = await prisma.user.create({
      data: {
        email: 'professional@example.com',
        username: 'professional',
        passwordHash: await bcrypt.hash('professional123', 10),
        fullName: 'Professional User',
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        roles: {
          create: {
            role: Role.PROFESSIONAL,
          },
        },
      },
    });

    // Create client user
    const clientUser = await prisma.user.create({
      data: {
        email: 'client@example.com',
        username: 'client',
        passwordHash: await bcrypt.hash('client123', 10),
        fullName: 'Client User',
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null,
        passwordResetToken: null,
        passwordResetExpires: null,
        roles: {
          create: {
            role: Role.CLIENT,
          },
        },
      },
    });

    // Create unverified user
    const unverifiedUser = await prisma.user.create({
      data: {
        email: 'unverified@example.com',
        username: 'unverified',
        passwordHash: await bcrypt.hash('unverified123', 10),
        fullName: 'Unverified User',
        emailVerified: null,
        emailVerificationToken: 'verification-token',
        emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        passwordResetToken: null,
        passwordResetExpires: null,
        roles: {
          create: {
            role: Role.CLIENT,
          },
        },
      },
    });

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 