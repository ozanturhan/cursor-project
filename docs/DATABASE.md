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
- `emailVerificationToken`: Token for email verification process
- `emailVerificationExpires`: Expiration time for email verification token
- `passwordResetToken`: Token for password reset process
- `passwordResetExpires`: Expiration time for password reset token
- `fullName`: User's full name
- `userType`: Enum (CLIENT/PROFESSIONAL)
- `image`: Optional profile image URL
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Relations:
  - One-to-one with Profile (for professionals)
  - One-to-many with Session
  - One-to-many with Account (for OAuth)
  - One-to-many with Booking (as client)
  - One-to-many with Booking (as professional)

### Account
Represents OAuth provider accounts linked to a user.
- `id`: UUID primary key
- `userId`: Foreign key to User
- `type`: Provider type (oauth, email, etc.)
- `provider`: OAuth provider name
- `providerAccountId`: Provider's unique account identifier
- `refreshToken`: OAuth refresh token
- `accessToken`: OAuth access token
- `expiresAt`: Token expiration timestamp
- `tokenType`: Type of access token
- `scope`: OAuth scopes
- `idToken`: OAuth ID token
- `sessionState`: OAuth session state
- Relations:
  - Many-to-one with User

### Session
Represents an active user session.
- `id`: UUID primary key
- `userId`: Foreign key to User
- `token`: Unique session token
- `expiresAt`: Session expiration timestamp
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp
- Relations:
  - Many-to-one with User

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

### UserRole
- `id`: UUID (Primary Key)
- `userId`: UUID (Foreign Key -> User)
- `role`: Enum (CLIENT, PROFESSIONAL)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Relationships
- One User can have multiple UserRoles (One-to-Many)

## Notes
- Users can have multiple roles simultaneously (e.g., both CLIENT and PROFESSIONAL)
- All users are initially assigned the CLIENT role upon registration
- Additional roles can be assigned later through role management endpoints
- Email verification is required before a user can log in
- Password reset tokens expire after 1 hour
- Email verification tokens expire after 24 hours

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

### Add Authentication Fields (20241230170211_add_auth_fields)
- Added email verification fields to User model
- Added password reset fields to User model
- Created Session model for managing user sessions
- Added relationships between User and Session models

## Future Considerations

1. **Indexes**:
   - Consider adding indexes on frequently queried fields
   - Monitor query performance

2. **Potential Additions**:
   - Rating/Review system
   - Payment information
   - Notification preferences
   - Session notes/history 