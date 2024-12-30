# RFC-001: Core Platform MVP Components

## RFC Number
RFC-001

## Title
Core Platform MVP Implementation

## Status
[x] Proposed
[ ] Accepted
[ ] Implemented
[ ] Deprecated

## Last Updated
2024-12-30

## Authors
- Project Team

## Overview
This RFC outlines the implementation details for the Core Platform MVP, which includes user authentication, professional profiles, availability calendar, and basic booking system. These components form the foundation of the consultation platform.

## Related RFCs
- RFC-002: Authentication System Design (Authentication implementation details)

## Motivation
The core platform components are essential to enable basic functionality for both professionals and clients. This phase will establish the fundamental infrastructure and user flows necessary for subsequent features.

## Detailed Design

### Architecture

#### Backend Architecture (NestJS)
1. Core Modules
   - AuthModule (Implementation detailed in RFC-002)
   - UsersModule
   - ProfilesModule
   - CalendarModule
   - BookingsModule
   - CommonModule (shared utilities)

2. Infrastructure
   - Prisma for database access
   - Class-validator for DTO validation
   - Passport for authentication strategies (see RFC-002)
   - Guards for route protection
   - Custom decorators for user context
   - Interceptors for response transformation

3. API Structure
   ```typescript
   src/
   ├── main.ts                 # Application entry point
   ├── app.module.ts           # Root module
   ├── prisma/                 # Prisma configuration
   │   ├── schema.prisma      # Prisma schema
   │   ├── migrations/        # Database migrations
   │   └── seed.ts           # Database seeding
   ├── common/                 # Shared utilities
   │   ├── decorators/
   │   ├── filters/
   │   ├── guards/
   │   ├── interceptors/
   │   └── pipes/
   ├── config/                 # Configuration
   │   ├── database.config.ts
   │   ├── auth.config.ts
   │   └── app.config.ts
   ├── modules/
   │   ├── auth/              # Authentication
   │   │   ├── auth.module.ts
   │   │   ├── auth.service.ts
   │   │   ├── auth.controller.ts
   │   │   └── dto/
   │   ├── users/             # User management
   │   ├── profiles/          # Professional profiles
   │   ├── calendar/          # Availability
   │   └── bookings/          # Booking management
   └── shared/                # Shared types/interfaces
   ```

4. Database Integration
   - Prisma Schema and Client
   - Prisma Migrations
   - Prisma Studio for data management
   - Transaction management with Prisma

#### Data Models (Prisma Schema)

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String?
  emailVerified DateTime?
  emailVerificationToken String?
  emailVerificationExpires DateTime?
  passwordResetToken String?
  passwordResetExpires DateTime?
  fullName      String
  userType      UserType
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  profile       Profile?
  sessions      Session[]
  bookingsAsClient    Booking[] @relation("ClientBookings")
  bookingsAsProfessional Booking[] @relation("ProfessionalBookings")
}

model Session {
  id          String    @id @default(uuid())
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  token       String    @unique
  expiresAt   DateTime
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Profile {
  id          String    @id @default(uuid())
  userId      String    @unique
  user        User      @relation(fields: [userId], references: [id])
  profession  String
  bio         String?
  hourlyRate  Decimal?
  avatarUrl   String?
  availability Availability[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Availability {
  id          String    @id @default(uuid())
  profileId   String
  profile     Profile   @relation(fields: [profileId], references: [id])
  dayOfWeek   Int       // 1-7 representing Monday-Sunday
  startHour   Int       // 0-23 representing hour of day
  startMinute Int       // 0-59 representing minutes
  endHour     Int       // 0-23 representing hour of day
  endMinute   Int       // 0-59 representing minutes
  createdAt   DateTime  @default(now())
}

model Booking {
  id              String    @id @default(uuid())
  clientId        String
  client          User      @relation("ClientBookings", fields: [clientId], references: [id])
  professionalId  String
  professional    User      @relation("ProfessionalBookings", fields: [professionalId], references: [id])
  startTime       DateTime
  endTime         DateTime
  status          BookingStatus
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

enum UserType {
  CLIENT
  PROFESSIONAL
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}
```

#### API Implementation Example

```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        fullName: data.fullName,
        userType: data.userType,
        profile: data.userType === 'PROFESSIONAL' ? {
          create: {
            profession: data.profession,
          }
        } : undefined
      },
      include: { profile: true }
    });
  }
}

// profiles.service.ts
@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService) {}

  async findAvailableProfessionals(searchParams: SearchProfilesDto) {
    return this.prisma.profile.findMany({
      where: {
        profession: { contains: searchParams.profession, mode: 'insensitive' },
        availability: {
          some: {
            dayOfWeek: searchParams.dayOfWeek
          }
        }
      },
      include: {
        user: true,
        availability: true
      }
    });
  }
}
```

### Dependencies Update
- Node.js v18+
- Next.js 14+
- NestJS v10+
- Next-Auth v5
- PostgreSQL 14+
- Prisma v5+
- React Query v5+
- AWS S3/GCP Storage
- SendGrid/AWS SES for emails

### Implementation Plan Update

#### Phase 1A: Foundation (2-3 weeks)
- Next.js project setup with TypeScript
- NestJS backend setup:
  - Module structure
  - Prisma schema and configuration
  - API structure
- Authentication implementation (as per RFC-002 Phase 1)
- Database schema implementation with Prisma
- Basic security measures

#### Phase 1B: Profile System (2 weeks)
- NestJS Profile module implementation
- Profile management features
- Image upload service
- Availability management

#### Phase 1C: Calendar & Booking (2 weeks)
- Calendar view implementation
- Booking management
- Availability checks
- Notification system setup

#### Phase 1D: UI/UX (2 weeks)
- Responsive design implementation
- Accessibility features
- Performance optimization
- User experience improvements

## Timeline
- Start Date: [Project Start Date]
- Target Completion: 8 weeks from start

## Dependencies
- Authentication system (RFC-002)
- Node.js v20+
- Next.js 14+
- NestJS v10+
- PostgreSQL 14+
- Prisma v5+
- React Query v5+
- AWS S3/GCP Storage (for file uploads)
- SendGrid/AWS SES (for emails)

## Security Considerations
- OAuth state parameter validation
- PKCE for mobile authentication
- Secure token storage
- CSRF protection
- Rate limiting on authentication endpoints
- Deep linking security
- Mobile browser security considerations

## Testing Requirements
- Unit tests for all API endpoints
- Integration tests for user flows
- E2E tests for critical paths
- Performance testing for API endpoints
- Security testing for authentication

## Documentation Requirements
- API documentation with Swagger/OpenAPI
- Database schema documentation
- Development setup guide
- Deployment documentation
- User guides for professionals and clients

## Open Questions
1. Yes, implementing Google and Apple login
2. Do we need webhook support for calendar updates?
3. Should we support multiple currencies for rates?
4. How to handle timezone differences?
5. Should we add more OAuth providers in Phase 1?
6. Do we need separate mobile-specific authentication endpoints?

## References
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next-Auth Documentation](https://next-auth.js.org)
- [OAuth for Mobile Apps Best Practices](https://datatracker.ietf.org/doc/html/rfc8252)
- [Apple Sign-in Requirements](https://developer.apple.com/sign-in-with-apple/get-started)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [JWT Best Practices](https://auth0.com/blog/jwt-security-best-practices/)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Calendar RFC 5545](https://tools.ietf.org/html/rfc5545) 