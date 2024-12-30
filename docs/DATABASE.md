# Database Documentation

## Overview
This document outlines the database schema and design decisions for the consultation platform. We use PostgreSQL as our database with Prisma as the ORM.

## Models

### User
Represents both clients and professionals in the system.
- `id`: UUID primary key
- `email`: Unique email address
- `passwordHash`: Optional hashed password (null for OAuth users)
- `emailVerified`: Timestamp of email verification
- `fullName`: User's full name
- `userType`: Enum (CLIENT/PROFESSIONAL)
- `image`: Optional profile image URL
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Relations:
  - One-to-one with Profile (for professionals)
  - One-to-many with Booking (as client)
  - One-to-many with Booking (as professional)

### Profile
Professional's detailed profile information.
- `id`: UUID primary key
- `userId`: Foreign key to User
- `profession`: Professional's occupation/specialty
- `bio`: Optional biography/description
- `hourlyRate`: Optional consultation rate
- `avatarUrl`: Optional avatar image URL
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Relations:
  - One-to-one with User
  - One-to-many with Availability

### Availability
Professional's available time slots.
- `id`: UUID primary key
- `profileId`: Foreign key to Profile
- `dayOfWeek`: Integer (1-7, representing Monday-Sunday)
- `startHour`: Integer (0-23, representing hour of day)
- `startMinute`: Integer (0-59, representing minutes)
- `endHour`: Integer (0-23, representing hour of day)
- `endMinute`: Integer (0-59, representing minutes)
- `createdAt`: Creation timestamp
- Relations:
  - Many-to-one with Profile

### Booking
Represents a consultation booking between a client and professional.
- `id`: UUID primary key
- `clientId`: Foreign key to User (client)
- `professionalId`: Foreign key to User (professional)
- `startTime`: Booking start datetime
- `endTime`: Booking end datetime
- `status`: Enum (PENDING/CONFIRMED/CANCELLED/COMPLETED)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Relations:
  - Many-to-one with User (client)
  - Many-to-one with User (professional)

## Enums

### UserType
- `CLIENT`: Regular user seeking consultations
- `PROFESSIONAL`: User offering consultation services

### BookingStatus
- `PENDING`: Initial booking state
- `CONFIRMED`: Booking confirmed by professional
- `CANCELLED`: Booking cancelled by either party
- `COMPLETED`: Consultation completed

## Design Decisions

1. **UUID Usage**: Using UUIDs instead of auto-incrementing IDs for better distribution and privacy.

2. **Soft Deletes**: Not implemented initially but can be added if needed by adding `deletedAt` timestamps.

3. **Time Handling**: 
   - Using separate hour and minute fields for availability times for better clarity and querying
   - Using `DateTime` for booking times to store full datetime
   - Availability times are stored in 24-hour format (0-23 hours)

4. **Relationships**:
   - User-Profile: One-to-one relationship for professionals
   - Profile-Availability: One-to-many for flexible scheduling
   - User-Booking: Separate relations for client and professional roles

## Database Management

### Development Setup
1. Ensure PostgreSQL is running (via Docker or local installation)
2. Set up environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/consultation_db?schema=public"
   ```
3. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

### Seed Data
The project includes seed data for development and testing purposes. To seed the database:
```bash
npx prisma db seed
```

#### Available Test Accounts
All accounts use the password: `test123`

**Professionals:**
- Therapist: therapist@example.com (Dr. Jane Smith)
  - Available: Mondays and Wednesdays, 9:00 - 17:00
  - Rate: $120/hour
- Career Coach: coach@example.com (John Coach)
  - Available: Tuesdays and Thursdays, 10:00 - 18:00
  - Rate: $90/hour

**Clients:**
- client1@example.com (Alice Johnson)
- client2@example.com (Bob Wilson)

#### Sample Data
- Multiple availability slots for professionals
- Sample bookings in different states (PENDING, CONFIRMED)
- Professional profiles with different specialties and rates

### Database Tools
- **Prisma Studio**: Visual database browser
  ```bash
  npx prisma studio
  ```
- **Database Reset**: To reset and reseed the database
  ```bash
  npx prisma migrate reset
  ```

## Migration History

### Initial Migration (20241230154641_init)
- Created all base tables
- Established relationships
- Set up enums
- Added timestamps

### Update Availability Time Format (20241230155920_update_availability_time_format)
- Changed availability time storage from DateTime to separate hour/minute fields
- Improved time representation and querying capabilities
- Migrated existing data to new format

## Future Considerations

1. **Indexes**:
   - Consider adding indexes on frequently queried fields
   - Monitor query performance

2. **Potential Additions**:
   - Rating/Review system
   - Payment information
   - Notification preferences
   - Session notes/history 