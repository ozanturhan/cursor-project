# RFC-002: Authentication System Design

## RFC Number
RFC-002

## Title
Authentication System Design

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
This RFC outlines the authentication system design that will work across all platforms (web, mobile, API) while maintaining security and user experience. The implementation will follow a phased approach, starting with core email authentication.

## Motivation
A well-designed authentication system is crucial for:
- Secure access to the platform
- Consistent user experience across platforms
- Scalable and maintainable codebase
- Support for future mobile applications
- Integration with third-party services

## Implementation Phases

### Phase 1: Core Email Authentication
1. **Features**
   - Email/password registration
   - Email/password login
   - Password reset flow
   - Email verification
   - Session management
   - Basic security measures

2. **Database Updates**
   ```prisma
   model User {
     // Existing fields...
     emailVerificationToken String?
     emailVerificationExpires DateTime?
     passwordResetToken String?
     passwordResetExpires DateTime?
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
   ```

3. **Backend Implementation (NestJS)**
   - Basic JWT implementation
   - Session management
   - Password hashing with Argon2
   - Email service integration
   - Rate limiting for auth endpoints

4. **Frontend Implementation (Next.js + Next-Auth)**
   - Next-Auth setup with custom provider
   ```typescript
   // pages/api/auth/[...nextauth].ts
   import NextAuth from 'next-auth';
   import CredentialsProvider from 'next-auth/providers/credentials';

   export default NextAuth({
     providers: [
       CredentialsProvider({
         name: 'Credentials',
         credentials: {
           email: { label: "Email", type: "email" },
           password: { label: "Password", type: "password" }
         },
         async authorize(credentials) {
           // Call our NestJS backend for authentication
           const response = await fetch('/api/auth/login', {
             method: 'POST',
             body: JSON.stringify(credentials),
             headers: { "Content-Type": "application/json" }
           });
           
           const user = await response.json();
           if (response.ok && user) {
             return user;
           }
           return null;
         }
       })
     ],
     callbacks: {
       async jwt({ token, user, account }) {
         // Add custom claims to JWT
         if (user) {
           token.id = user.id;
           token.userType = user.userType;
         }
         return token;
       },
       async session({ session, token }) {
         // Add custom claims to session
         if (session.user) {
           session.user.id = token.id;
           session.user.userType = token.userType;
         }
         return session;
       }
     },
     pages: {
       signIn: '/auth/signin',
       signOut: '/auth/signout',
       error: '/auth/error',
       verifyRequest: '/auth/verify-request',
       newUser: '/auth/new-user'
     },
     session: {
       strategy: 'jwt',
       maxAge: 24 * 60 * 60, // 24 hours
     },
     jwt: {
       secret: process.env.JWT_SECRET,
     }
   });
   ```

   - Custom sign-in page
   ```typescript
   // pages/auth/signin.tsx
   import { signIn } from 'next-auth/react';

   export default function SignIn() {
     const handleSubmit = async (e) => {
       e.preventDefault();
       const result = await signIn('credentials', {
         email: e.target.email.value,
         password: e.target.password.value,
         redirect: false,
       });
       // Handle result
     };

     return (
       // Sign-in form JSX
     );
   }
   ```

   - Protected routes with middleware
   ```typescript
   // middleware.ts
   export { default } from 'next-auth/middleware';

   export const config = {
     matcher: [
       '/dashboard/:path*',
       '/profile/:path*',
       '/bookings/:path*'
     ]
   };
   ```

   - Session handling in components
   ```typescript
   import { useSession } from 'next-auth/react';

   export default function ProtectedComponent() {
     const { data: session, status } = useSession();

     if (status === 'loading') {
       return <div>Loading...</div>;
     }

     if (status === 'unauthenticated') {
       return <div>Access Denied</div>;
     }

     return (
       // Protected content
     );
   }
   ```

5. **Integration Points**
   - Next-Auth communicates with NestJS backend
   - JWT token format consistency
   - Session management synchronization
   - Error handling standardization
   - Type sharing between frontend and backend

6. **API Communication After Authentication**
   
   a. **Web Application (Next.js)**
   ```typescript
   // lib/api.ts
   import { getSession } from 'next-auth/react';

   export const api = {
     async fetch(endpoint: string, options: RequestInit = {}) {
       const session = await getSession();
       
       return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
         ...options,
         headers: {
           ...options.headers,
           'Authorization': `Bearer ${session?.accessToken}`,
           'Content-Type': 'application/json',
         },
       });
     },
     
     // Utility methods
     async get(endpoint: string) {
       return this.fetch(endpoint).then(res => res.json());
     },
     
     async post(endpoint: string, data: any) {
       return this.fetch(endpoint, {
         method: 'POST',
         body: JSON.stringify(data),
       }).then(res => res.json());
     },
     // ... other methods
   };

   // hooks/api/profile.ts
   import { useQuery } from '@tanstack/react-query';
   import { useSession } from 'next-auth/react';
   
   export function useProfile() {
     const { data: session } = useSession();
     
     return useQuery({
       queryKey: ['profile'],
       queryFn: () => api.get('/users/profile'),
       enabled: !!session,
     });
   }
   
   // Example usage in a component
   function ProfileComponent() {
     const { data: profile, isLoading, error } = useProfile();
     
     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>Error loading profile</div>;
     
     return (
       <div>
         <h1>{profile.name}</h1>
         <p>{profile.email}</p>
       </div>
     );
   }
   ```

   b. **Token Flow and Generation**
   ```typescript
   // NestJS auth.service.ts
   @Injectable()
   export class AuthService {
     constructor(
       private jwtService: JwtService,
       private configService: ConfigService,
     ) {}

     async login(email: string, password: string) {
       const user = await this.validateUser(email, password);
       
       // Generate both access and refresh tokens
       const tokens = await this.generateTokens(user);
       
       return {
         user: {
           id: user.id,
           email: user.email,
           userType: user.userType,
         },
         ...tokens, // { accessToken, refreshToken }
       };
     }

     private async generateTokens(user: User) {
       const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(
           { sub: user.id, email: user.email, type: 'access' },
           { expiresIn: '15m' }
         ),
         this.jwtService.signAsync(
           { sub: user.id, email: user.email, type: 'refresh' },
           { expiresIn: '7d' }
         ),
       ]);

       return { accessToken, refreshToken };
     }
   }

   // Next-Auth configuration update
   // pages/api/auth/[...nextauth].ts
   export default NextAuth({
     // ... other config
     callbacks: {
       async jwt({ token, user }) {
         // Initial sign in
         if (user) {
           return {
             ...token,
             accessToken: user.accessToken,
             refreshToken: user.refreshToken,
             accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
           };
         }

         // Return previous token if not expired
         if (Date.now() < token.accessTokenExpires) {
           return token;
         }

         // Access token expired, try to refresh it
         return refreshAccessToken(token);
       },
       async session({ session, token }) {
         session.user.accessToken = token.accessToken;
         session.user.id = token.sub;
         session.user.userType = token.userType;
         return session;
       },
     },
   });

   // Token refresh function
   async function refreshAccessToken(token: JWT) {
     try {
       const response = await fetch('/api/auth/refresh', {
         method: 'POST',
         headers: {
           'Authorization': `Bearer ${token.refreshToken}`,
         },
       });

       const tokens = await response.json();

       if (!response.ok) throw tokens;

       return {
         ...token,
         accessToken: tokens.accessToken,
         refreshToken: tokens.refreshToken,
         accessTokenExpires: Date.now() + 15 * 60 * 1000,
       };
     } catch (error) {
       return {
         ...token,
         error: 'RefreshAccessTokenError',
       };
     }
   }
   ```

   c. **Mobile Application**
   ```typescript
   // mobile/src/utils/api.ts
   class ApiClient {
     private baseUrl: string;
     private accessToken: string | null;

     constructor(baseUrl: string) {
       this.baseUrl = baseUrl;
       this.accessToken = null;
     }

     setAccessToken(token: string) {
       this.accessToken = token;
     }

     async fetch(endpoint: string, options: RequestInit = {}) {
       if (!this.accessToken) {
         throw new Error('Not authenticated');
       }

       return fetch(`${this.baseUrl}${endpoint}`, {
         ...options,
         headers: {
           ...options.headers,
           'Authorization': `Bearer ${this.accessToken}`,
           'Content-Type': 'application/json',
         },
       });
     }

     // Utility methods similar to web app
   }

   // Usage in mobile app
   const api = new ApiClient(CONFIG.API_URL);
   
   // After login
   api.setAccessToken(authResult.accessToken);
   ```

   d. **Token Refresh Strategy**
   ```typescript
   // Shared logic for handling token expiration
   async function handleTokenExpiration(response: Response) {
     if (response.status === 401) {
       // Token expired
       const refreshResult = await refreshToken();
       if (refreshResult.success) {
         // Retry original request with new token
         return retryRequest(/* ... */);
       } else {
         // Redirect to login
         signOut();
       }
     }
     return response;
   }
   ```

   d. **Backend JWT Validation**
   ```typescript
   // NestJS JWT Guard
   @Injectable()
   export class JwtAuthGuard extends AuthGuard('jwt') {
     constructor(private configService: ConfigService) {
       super({
         secret: configService.get('JWT_SECRET'),
         signOptions: { expiresIn: '24h' },
       });
     }

     handleRequest(err: any, user: any, info: any) {
       if (err || !user) {
         throw new UnauthorizedException('Invalid token');
       }
       return user;
     }
   }

   // Usage in controllers
   @Controller('api')
   export class ApiController {
     @UseGuards(JwtAuthGuard)
     @Get('protected-route')
     async getProtectedData() {
       // Only accessible with valid JWT
     }
   }
   ```

### Phase 2: OAuth Integration (Future)
1. **Features**
   - Google OAuth integration
   - Account linking
   - OAuth session management
   - Profile data sync

2. **Database Updates**
   ```prisma
   model Account {
     id                String  @id @default(uuid())
     userId            String
     type              String
     provider          String
     providerAccountId String
     refreshToken      String?
     accessToken       String?
     expiresAt         Int?
     tokenType         String?
     scope             String?
     user              User    @relation(fields: [userId], references: [id])

     @@unique([provider, providerAccountId])
   }
   ```

### Phase 3: Mobile Support (Future)
1. **Features**
   - Mobile-specific token handling
   - Biometric authentication
   - Offline authentication
   - Push notification integration

### Phase 4: Enhanced Security (Future)
1. **Features**
   - Multi-factor authentication
   - Hardware security keys
   - Advanced session management
   - Security audit logging

## Detailed Design (Phase 1)

### Authentication Flow

#### 1. Registration Flow
1. User submits email/password
2. Validate email and password requirements
3. Hash password with Argon2
4. Create user record
5. Generate verification token
6. Send verification email
7. Return success response

#### 2. Login Flow
1. User submits email/password
2. Validate credentials
3. Check email verification status
4. Generate JWT session token
5. Create session record
6. Return token and user data

#### 3. Password Reset Flow
1. User requests reset
2. Generate reset token
3. Send reset email
4. User submits new password
5. Validate and update password
6. Invalidate existing sessions

### Security Measures (Phase 1)

1. **Password Security**
   - Minimum length: 8 characters
   - Require mix of characters
   - Prevent common passwords
   - Hash using Argon2

2. **Rate Limiting**
   - Login attempts: 5 per 15 minutes
   - Password reset: 3 per hour
   - Email verification: 3 per hour

3. **Session Security**
   - 24-hour session lifetime
   - Secure HTTP-only cookies
   - CSRF protection
   - Single session per user (optional)

### API Endpoints (Phase 1)

```typescript
@Controller('auth')
export class AuthController {
  @Post('register')
  async register(@Body() userData: RegisterDto): Promise<void>

  @Post('verify-email')
  async verifyEmail(@Query('token') token: string): Promise<void>

  @Post('login')
  async login(@Body() credentials: LoginDto): Promise<AuthResponse>

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Session() session: SessionEntity): Promise<void>

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string): Promise<void>

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() resetData: ResetPasswordDto
  ): Promise<void>

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@User() user: UserEntity): Promise<UserResponse>
}
```

### Error Handling (Phase 1)
```typescript
enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  RATE_LIMITED = 'RATE_LIMITED',
}

interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: Record<string, any>;
}
```

## Testing Strategy (Phase 1)
1. **Unit Tests**
   - Password hashing
   - Token generation/validation
   - Rate limiting logic
   - Email templates

2. **Integration Tests**
   - Registration flow
   - Login flow
   - Password reset flow
   - Session management

3. **Security Tests**
   - Password strength validation
   - Rate limiting effectiveness
   - Token security
   - Session handling

## Monitoring (Phase 1)
1. **Metrics**
   - Registration success/failure rates
   - Login attempts
   - Password reset requests
   - Session statistics

2. **Alerts**
   - High failure rates
   - Unusual login patterns
   - Rate limit breaches
   - Token validation failures

## Success Criteria (Phase 1)
1. Successful user registration with email verification
2. Secure login with session management
3. Working password reset flow
4. Proper error handling and rate limiting
5. Test coverage > 80%

## Dependencies (Phase 1)
- NestJS Passport module
- Argon2 for password hashing
- JWT module
- Next-Auth v5
- Email service (SendGrid/AWS SES)
- Rate limiting module 