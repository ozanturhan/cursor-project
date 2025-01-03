# CONVERSATION-010: Removal of Role-Based System

## Date
January 15, 2024

## Participants
- Development Team

## Context
Initially, the system was designed with a strict role-based approach where users were categorized as either clients or professionals. However, this design was found to be unnecessarily restrictive as the platform's core functionality revolves around users being able to both provide and receive consultancy services. The decision was made to remove the role-based system in favor of a more flexible approach where any user can act as both a consultant and a client based on their profile and calendar settings.

## Key Decisions
1. **Remove Role-Based System**:
   - Removed `Role` enum from Prisma schema
   - Removed `UserRole` model and its relationships
   - Simplified user registration process by removing role selection
   - Updated authentication flow to remove role-based logic

2. **Flexible User Model**:
   - All users have the same base capabilities
   - Users can provide consultancy by setting up their profile and calendar
   - Users can book consultations with other users who have available slots
   - No explicit role distinction needed

3. **Profile-Based Access**:
   - Access to professional features is determined by profile completion
   - Users with completed profiles and available calendar slots can be booked
   - No need for role-based permission checks

## Code Changes

### Prisma Schema Update
```prisma
// Removed Role enum and UserRole model
model User {
  id                     String    @id @default(uuid())
  email                  String    @unique
  username               String    @unique
  passwordHash           String
  // ... other fields ...

  // Relations
  profiles              Profile[]
  clientBookings        Booking[]  @relation("ClientBookings")
  professionalBookings  Booking[]  @relation("ProfessionalBookings")
}
```

### Authentication Service Update
```typescript
async register(data: RegisterDto): Promise<User> {
  // Simplified registration without role assignment
  const user = await this.prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      passwordHash,
      fullName: data.fullName,
      emailVerificationToken: verificationToken,
    },
  });
  // ... rest of the code
}
```

## Follow-up Actions
1. ✅ Update Prisma schema and create migration
2. ✅ Update authentication service and DTOs
3. ✅ Update unit tests and e2e tests
4. ✅ Remove role-based logic from frontend components
5. ⏳ Update API documentation to reflect changes
6. ⏳ Update frontend profile management to handle the new approach

## References
- [RFC-007: User Roles Update](../rfc/RFC-007-User-Roles-Update.md)
- [RFC-010: User Profiles](../rfc/RFC-010-User-Profiles.md)
- [PRD: User Requirements & Personas](../PRD.md)

## Notes
- The change simplifies the system architecture and user experience
- Provides more flexibility for users to participate in both sides of the platform
- Access control is now based on profile completion and calendar availability rather than explicit roles
- Future features should consider this flexible approach when designing user interactions 