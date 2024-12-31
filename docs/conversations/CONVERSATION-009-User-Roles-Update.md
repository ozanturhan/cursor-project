# CONVERSATION-009: User Roles Update Implementation

## Date
December 31, 2023

## Participants
- Development Team

## Context
During the implementation of the authentication system, we identified a limitation in our initial user role design. The system originally restricted users to being either a client or a professional, but not both. This conversation covers the discussion and implementation of a more flexible role system.

## Key Decisions
1. **Multiple Roles**: Allow users to have multiple roles simultaneously
   - Users can be both clients and professionals
   - All users start with CLIENT role by default
   - PROFESSIONAL role can be added later

2. **Database Changes**:
   - Removed `userType` field from User model
   - Created new `UserRole` model for role management
   - Implemented one-to-many relationship between User and UserRole

3. **Authentication Flow**:
   - Modified registration to automatically assign CLIENT role
   - Updated JWT tokens to include unique identifiers (jti claim)
   - Maintained token expiry times (15m for access, 7d for refresh)

4. **Frontend Updates**:
   - Removed role selection from registration form
   - Updated UI to handle multiple user roles
   - Modified state management for role-based features

## Code Examples
### User Role Model
```prisma
model UserRole {
  id        String   @id @default(uuid())
  userId    String
  role      Role
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])

  @@unique([userId, role])
}
```

### JWT Token Generation
```typescript
private async generateTokens(user: User) {
  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(
      { 
        sub: user.id, 
        email: user.email,
        jti: randomBytes(16).toString('hex')
      },
      { expiresIn: '15m' },
    ),
    this.jwtService.signAsync(
      { 
        sub: user.id, 
        email: user.email,
        jti: randomBytes(16).toString('hex')
      },
      { expiresIn: '7d' },
    ),
  ]);

  return { accessToken, refreshToken };
}
```

## Follow-up Actions
1. ✅ Update E2E tests to verify role assignment
2. ✅ Test token refresh functionality
3. ✅ Update documentation (DATABASE.md and new RFC)
4. ✅ Remove role selection from registration UI
5. ⏳ Implement role management endpoints (add/remove roles)
6. ⏳ Add role-based access control for professional features

## References
- [RFC-007: User Roles Update](../rfc/RFC-007-User-Roles-Update.md)
- [RFC-002: Authentication](../rfc/RFC-002-Authentication.md)
- [RFC-003: NextAuth Integration](../rfc/RFC-003-NextAuth-Integration.md)

## Notes
- The change simplifies the initial user experience by removing role choice
- Future work needed for role management UI and professional onboarding flow
- Consider implementing role-specific permissions system 