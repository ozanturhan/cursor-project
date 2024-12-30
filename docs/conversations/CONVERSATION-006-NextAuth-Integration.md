# Next-Auth Integration Planning

## Overview
This conversation covers the planning and approval of Next-Auth integration with our existing backend authentication system. The discussion led to the creation of RFC-003 and the reprioritization of authentication-related tasks.

## Key Decisions

### 1. Integration Approach
- Custom credentials provider for backend integration
- JWT-based session handling
- Token refresh mechanism with backend alignment
- Protected routes using Next-Auth middleware

### 2. Token Management
- Access token: 15 minutes (matching backend)
- Refresh token: 7 days (matching backend)
- Token storage in HTTP-only cookies
- Automatic token refresh implementation

### 3. Implementation Priorities
1. Next-Auth basic setup
2. Custom provider implementation
3. Session handling
4. Protected routes
5. Error handling and user feedback

### 4. Timeline
- Week 1: Basic Setup
- Week 1-2: Core Features
- Week 2: Enhancement
- Week 2-3: Testing

## Technical Details

### 1. Custom Provider Implementation
```typescript
export const AuthProvider = {
  id: 'consultation-backend',
  type: 'credentials',
  authorize: async (credentials) => {
    // Backend integration
    // Token handling
    // User data management
  }
}
```

### 2. Session Configuration
```typescript
export const session = {
  strategy: 'jwt',
  maxAge: 7 * 24 * 60 * 60,
  updateAge: 15 * 60
}
```

### 3. Token Refresh
```typescript
async jwt({ token, user, account }) {
  // Initial sign in
  // Token validation
  // Refresh mechanism
  // Error handling
}
```

## Documentation Updates
1. Created RFC-003 for Next-Auth integration
2. Updated Progress Tracker
3. Reprioritized next steps
4. Added implementation timeline

## Security Considerations
- Token storage security
- CSRF protection
- Error handling
- Session management
- Token refresh security

## Next Steps
1. Begin Phase 1 implementation
   - Next-Auth package setup
   - Environment configuration
   - Custom provider implementation
2. Implement core authentication flows
3. Add protected routes
4. Implement error handling

## Open Questions Addressed
1. Social login providers: Future consideration
2. Multiple sessions: Not initially needed
3. Remember me: To be implemented in Phase 2
4. Progressive token refresh: Under consideration

## References
- [RFC-003: Next-Auth Integration](../rfc/RFC-003-NextAuth-Integration.md)
- [RFC-002: Authentication System](../rfc/RFC-002-Authentication.md)
- [Next-Auth Documentation](https://next-auth.js.org/) 