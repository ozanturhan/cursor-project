# RFC 003: Next-Auth Integration

## Status
- [x] Proposed
- [x] Accepted
- [ ] Implemented
- [ ] Tested

## Summary
This RFC outlines the integration of Next-Auth with our existing backend authentication system, providing a secure and seamless authentication experience in the frontend.

## Background
The backend authentication system is implemented and tested. We need to integrate this with our Next.js frontend using Next-Auth to provide a secure and user-friendly authentication experience.

## Detailed Design

### Integration Architecture
1. Custom Provider
   ```typescript
   // apps/frontend/src/auth/auth-provider.ts
   import { AuthResponse } from '@consultation/types'

   export const AuthProvider = {
     id: 'consultation-backend',
     name: 'Consultation Backend',
     type: 'credentials',
     credentials: {
       email: { label: 'Email', type: 'email' },
       password: { label: 'Password', type: 'password' }
     },
     authorize: async (credentials) => {
       try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(credentials)
         });

         if (!response.ok) {
           throw new Error('Invalid credentials');
         }

         const auth: AuthResponse = await response.json();
         
         return {
           id: auth.user.id,
           email: auth.user.email,
           name: auth.user.fullName,
           accessToken: auth.accessToken,
           refreshToken: auth.refreshToken
         };
       } catch (error) {
         return null;
       }
     }
   }
   ```

2. Session Handling
   ```typescript
   // apps/frontend/src/auth/session.ts
   export const session = {
     strategy: 'jwt',
     maxAge: 7 * 24 * 60 * 60, // 7 days (matching backend refresh token)
     updateAge: 15 * 60, // 15 minutes (matching backend access token)
   }
   ```

3. JWT Handling
   ```typescript
   // apps/frontend/src/auth/jwt.ts
   export const jwt = {
     secret: process.env.NEXTAUTH_SECRET,
     maxAge: 15 * 60, // 15 minutes (matching backend)
     async encode({ token }) {
       return token.accessToken as string;
     },
     async decode({ token }) {
       // We use the backend's JWT, no need to decode
       return token as JWT;
     }
   }
   ```

### Token Refresh Implementation
```typescript
// apps/frontend/src/auth/refresh.ts
export async function refreshToken(token: string): Promise<AuthResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: token })
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

// In [...nextauth].ts
callbacks: {
  async jwt({ token, user, account }) {
    // Initial sign in
    if (account && user) {
      return {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
        accessTokenExpires: Date.now() + 15 * 60 * 1000,
      };
    }

    // Return token if it's still valid
    if (Date.now() < token.accessTokenExpires) {
      return token;
    }

    // Refresh token
    try {
      const auth = await refreshToken(token.refreshToken);
      return {
        accessToken: auth.accessToken,
        refreshToken: auth.refreshToken,
        accessTokenExpires: Date.now() + 15 * 60 * 1000,
      };
    } catch {
      return { ...token, error: 'RefreshTokenError' };
    }
  },
  
  async session({ session, token }) {
    session.accessToken = token.accessToken;
    session.error = token.error;
    return session;
  }
}
```

### Authentication Flow
1. Sign In
   - User submits credentials
   - Next-Auth calls custom provider
   - Provider validates with backend
   - JWT created with access and refresh tokens
   - Session established

2. Session Management
   - Access token stored in JWT
   - Refresh token stored securely
   - Session automatically refreshed
   - Token rotation handled

3. Protected Routes
   - Middleware checks session
   - Redirects to login if needed
   - Handles token refresh
   - Manages loading states

### Implementation Details

1. Next-Auth Configuration
   ```typescript
   // apps/frontend/src/pages/api/auth/[...nextauth].ts
   import NextAuth from 'next-auth'
   import { AuthProvider } from '@/auth/auth-provider'

   export default NextAuth({
     providers: [AuthProvider],
     session,
     jwt,
     pages: {
       signIn: '/auth/login',
       signOut: '/auth/logout',
       error: '/auth/error',
       verifyRequest: '/auth/verify',
     },
     callbacks: {
       async jwt({ token, user, account }) {
         // Handle JWT callback
       },
       async session({ session, token }) {
         // Handle session callback
       }
     }
   })
   ```

2. Protected API Routes
   ```typescript
   // apps/frontend/src/middleware.ts
   export { default } from 'next-auth/middleware'

   export const config = {
     matcher: [
       '/dashboard/:path*',
       '/profile/:path*',
       '/api/protected/:path*'
     ]
   }
   ```

3. Client-Side Authentication
   ```typescript
   // apps/frontend/src/hooks/useAuth.ts
   import { useSession, signIn, signOut } from 'next-auth/react'

   export const useAuth = () => {
     const { data: session, status } = useSession()
     
     return {
       user: session?.user,
       isAuthenticated: !!session,
       isLoading: status === 'loading',
       signIn,
       signOut
     }
   }
   ```

### Error Handling
1. Authentication Errors
   - Invalid credentials
   - Expired tokens
   - Network issues
   - Server errors

2. Session Errors
   - Session expiration
   - Token refresh failures
   - Invalid tokens

3. User Feedback
   - Loading states
   - Error messages
   - Redirect handling
   - Success notifications

## Testing Strategy
1. Unit Tests
   - Custom provider
   - JWT handling
   - Session management
   - Auth hooks

2. Integration Tests
   - Sign in flow
   - Protected routes
   - Token refresh
   - Error handling

3. E2E Tests
   - Complete auth flow
   - Session persistence
   - Protected navigation
   - Error scenarios

## Security Considerations
1. Token Storage
   - Access token in memory
   - Refresh token in HTTP-only cookie
   - Session data encryption

2. CSRF Protection
   - CSRF tokens
   - Same-origin policy
   - Secure cookies

3. Error Exposure
   - Limited error details
   - Secure error logging
   - User-friendly messages

## Implementation Timeline
1. Phase 1: Basic Setup (Week 1)
   - [ ] Next-Auth package installation and configuration
   - [ ] Custom provider implementation
   - [ ] Basic session handling
   - [ ] Environment variables setup

2. Phase 2: Core Features (Week 1-2)
   - [ ] Protected routes implementation
   - [ ] Token refresh mechanism
   - [ ] Error handling setup
   - [ ] Session management

3. Phase 3: Enhancement (Week 2)
   - [ ] Loading states implementation
   - [ ] Error messages and notifications
   - [ ] User feedback components
   - [ ] Redirect handling

4. Phase 4: Testing (Week 2-3)
   - [ ] Unit tests for auth hooks
   - [ ] Integration tests for auth flow
   - [ ] E2E tests for user journeys
   - [ ] Security testing

## Open Questions
1. Should we implement social login providers in the future?
2. Do we need to handle multiple sessions per user?
3. How should we handle remember me functionality?
4. Should we implement progressive token refresh?

## References
- [Next-Auth Documentation](https://next-auth.js.org/)
- [JWT Best Practices](https://auth0.com/blog/jwt-authentication-best-practices/)
- [RFC-002: Authentication System](./RFC-002-Authentication.md) 