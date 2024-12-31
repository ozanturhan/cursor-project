import { AuthResponse } from '@/types/auth';
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'consultation-backend',
      name: 'Consultation Backend',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;
        
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
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (matching backend refresh token)
    updateAge: 15 * 60, // 15 minutes (matching backend access token)
  },
  callbacks: {
    async jwt({ token, user, account }: { token: JWT; user: any; account: any }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
      }

      // Return token if it's still valid
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Refresh token
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: token.refreshToken })
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const auth: AuthResponse = await response.json();

        return {
          ...token,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      } catch {
        return { ...token, error: 'RefreshTokenError' };
      }
    },
    
    async session({ session, token }: { session: any; token: JWT }) {
      return {
        ...session,
        accessToken: token.accessToken,
        error: token.error,
        user: {
          ...session.user,
          id: token.sub
        }
      };
    }
  },
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },
}; 