export interface User {
  id: string;
  email: string;
  fullName: string;
  username: string;
  image?: string | null;
  profiles?: {
    username: string | null;
  }[];
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
    user: {
      id: string;
      email?: string;
      name?: string;
      username: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email?: string;
    name?: string;
    username: string;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: 'RefreshTokenError';
    username: string;
  }
} 