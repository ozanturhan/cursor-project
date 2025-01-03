# RFC 002: Authentication System

## Status
- [x] Proposed
- [x] Accepted
- [x] Implemented
- [x] Tested

## Summary
This RFC outlines the authentication system implementation for the consultation platform, including user registration, login, email verification, token refresh, and password reset functionality.

## Background
The platform requires a secure and robust authentication system to manage user access and protect sensitive information, while still maintaining public accessibility for certain features.

## Detailed Design

### Route Access Levels
1. Public Routes (No Authentication Required)
   - Authentication pages (/auth/*)
   - Profile pages (/profile/*)
   - Landing pages
   - Public documentation

2. Protected Routes (Authentication Required)
   - Profile management
   - Account settings
   - Booking system
   - Consultation features

### Authentication Flow
1. Registration
   - User submits registration details
   - System creates user account with unverified status
   - Verification email is sent
   - Profile is created based on user type

2. Email Verification
   - User receives verification email with token
   - Token is valid for 24 hours
   - Email must be verified before login is allowed
   - User can request resend of verification email (not implemented yet)

3. Login
   - User submits credentials
   - System verifies email status
   - System validates credentials
   - System generates access and refresh tokens
   - Session is created with refresh token

4. Token Refresh
   - System validates refresh token
   - System verifies session exists and is valid
   - New access and refresh tokens are generated
   - Session is updated with new refresh token

5. Password Reset (not implemented yet)
   - User requests password reset
   - System sends reset token (valid for 1 hour)
   - User submits new password with token
   - All existing sessions are invalidated

### Security Measures
- Rate limiting on all auth endpoints
- Token expiration:
  - Access tokens: 15 minutes
  - Refresh tokens: 7 days
  - Email verification: 24 hours
  - Password reset: 1 hour
- Password hashing using bcrypt
- JWT with unique timestamps for token generation
- Session tracking for refresh tokens
- Email verification requirement
- Account locking after failed attempts (not implemented yet)

### Test Coverage
#### Unit Tests
- User registration
  - Success case
  - Duplicate email case
- Login
  - Success case
  - Unverified email case
  - Invalid credentials case
- Token refresh
  - Success case
  - Invalid token case
  - Wrong token type case
- Email verification
  - Success case
  - Invalid token case

#### End-to-End Tests
- Complete authentication flow
  - Registration
  - Email verification
  - Login
  - Protected route access
  - Token refresh
  - Password reset

### Implementation Details
```typescript
// Key interfaces and types
interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    userType: UserType;
  };
  accessToken: string;
  refreshToken: string;
}

// Token payload structure
interface TokenPayload {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
  iat: number;
}
```

## Testing Environment
- Isolated Docker container for e2e tests
- Separate test database
- Clean state between test suites
- Comprehensive test coverage for all flows

## Security Considerations
1. All sensitive routes are protected with JWT authentication
2. Tokens include timestamp to ensure uniqueness
3. Email verification required before access
4. Rate limiting on all authentication endpoints
5. Secure password reset flow
6. Session management for refresh tokens

## Open Questions
1. Should we implement additional 2FA methods?
2. Do we need to adjust token expiration times?
3. Should we add IP-based rate limiting?

## Timeline
- [x] Initial implementation
- [x] Unit tests
- [x] E2E tests
- [x] Email service integration
- [ ] Password reset functionality
- [ ] Resend verification email
- [ ] Additional security features

## Implementation Status
### Completed Features
1. Core Authentication
   - [x] User registration
   - [x] Login with JWT
   - [x] Token refresh
   - [x] Session management

2. Email Verification
   - [x] Token generation
   - [x] Email service integration
   - [x] Frontend verification flow
   - [x] Server component implementation
   - [x] User feedback system
   - [ ] Resend verification email

3. Security Features
   - [x] Password hashing
   - [x] JWT implementation
   - [x] Rate limiting
   - [x] Session tracking
   - [x] Email verification requirement
   - [ ] Account locking after failed attempts

### Pending Features
1. Password Management
   - [ ] Password reset flow
   - [ ] Password reset email templates
   - [ ] Frontend reset password page
   - [ ] Session invalidation after reset

2. Additional Security
   - [ ] Account locking after failed attempts
   - [ ] IP-based rate limiting
   - [ ] Resend verification email functionality

## References
- [Next.js Authentication Documentation](https://nextjs.org/docs/authentication)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [JWT Best Practices](https://auth0.com/blog/jwt-authentication-best-practices/)
- [Password Hashing](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [CONVERSATION-001: Authentication Implementation](../conversations/CONVERSATION-001-Authentication-Implementation.md)
- [CONVERSATION-002: Auth Schema Implementation](../conversations/CONVERSATION-002-Auth-Schema-Implementation.md)
- [CONVERSATION-003: Core Auth Implementation](../conversations/CONVERSATION-003-Core-Auth-Implementation.md)
- [CONVERSATION-004: Auth Testing](../conversations/CONVERSATION-004-Auth-Testing.md)
- [CONVERSATION-005: Auth Test Fixes](../conversations/CONVERSATION-005-Auth-Test-Fixes.md) 