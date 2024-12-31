export interface User {
  id: string;
  email: string;
  fullName: string;
  roles?: {
    id: string;
    userId: string;
    role: 'CLIENT' | 'PROFESSIONAL';
    createdAt: Date;
    updatedAt: Date;
  }[];
  image?: string | null;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: 'RefreshTokenError';
    user: User;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    roles?: {
      id: string;
      userId: string;
      role: 'CLIENT' | 'PROFESSIONAL';
      createdAt: Date;
      updatedAt: Date;
    }[];
    image?: string | null;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: 'RefreshTokenError';
    roles?: {
      id: string;
      userId: string;
      role: 'CLIENT' | 'PROFESSIONAL';
      createdAt: Date;
      updatedAt: Date;
    }[];
  }
} 