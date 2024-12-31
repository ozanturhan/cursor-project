import { AuthResponse } from '@/types/auth';
import type { NextAuthOptions } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authApi } from '@/api/auth';
import { log } from 'console';

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
          const auth = await authApi.login({
            email: credentials.email,
            password: credentials.password,
          });
          
          return {
            id: auth.user.id,
            email: auth.user.email,
            name: auth.user.fullName,
            roles: auth.user.roles,
            accessToken: auth.accessToken,
            refreshToken: auth.refreshToken,
            image: auth.user.image || null
          };
        } catch (error: any) {
          if (error.response?.data?.message === 'Please verify your email first') {
            throw new Error('unverified');
          }
          console.error('Auth error:', error);
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
        console.log('initial sign in: user', user);
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
          roles: user.roles
        };
      }


      console.log('token', token);
      // Return token if it's still valid
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Refresh token
      try {
        console.log('refreshing token');
        const auth = await authApi.refreshToken(token.refreshToken);

        return {
          ...token,
          accessToken: auth.accessToken,
          refreshToken: auth.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
          roles: auth.user.roles
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
          id: token.sub,
          roles: token.roles
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