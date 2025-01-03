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