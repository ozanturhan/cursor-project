# CONVERSATION-001: Profile Username Implementation

## Date
2024-01-03

## Participants
- Development Team

## Context
During the implementation of the profile module (RFC-010), it was identified that using UUIDs for profile URLs is not user-friendly. The team discussed implementing a username system similar to Twitter or GitHub for more memorable and user-friendly profile URLs.

## Key Decisions
1. Add a unique username field to the Profile model
2. Change profile URLs from `/profile/:userId` to `/profile/:username`
3. Create a new RFC (RFC-013) for the username feature
4. Implement username validation and availability checking
5. Define username requirements and restrictions
6. Create a list of reserved usernames for system protection

## Code Examples
### Current URL Structure
```typescript
// Current
GET /api/profile/1kwek2234kwrkwe

// New
GET /api/profile/ozanturhan
```

### Schema Change
```prisma
model Profile {
  id          String    @id @default(uuid())
  userId      String    @unique
  username    String    @unique // New field
  // ... existing fields ...

  @@index([username])
}
```

## Follow-up Actions
1. Implement username feature (RFC-013)
   - Update database schema
   - Add validation
   - Create new endpoints
2. Continue with frontend profile implementation (RFC-010)
   - Create profile pages
   - Implement forms
   - Add availability management

## References
- [RFC-010: User Profiles](../rfc/RFC-010-User-Profiles.md)
- [RFC-013: Profile Username](../rfc/RFC-013-Profile-Username.md)

## Notes
- Username changes should be rate limited
- Need to handle existing profiles during migration
- Consider implementing username history tracking 