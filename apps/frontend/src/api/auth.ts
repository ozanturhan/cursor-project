import { AuthResponse, User } from '@/types/auth';
import { api } from '@/lib/axios';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  roles: { role: 'CLIENT' | 'PROFESSIONAL' }[];
}

interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return api.post('/auth/register', data).then((response) => response.data);
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    return api.post('/auth/login', data).then((response) => response.data);
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return api.post('/auth/refresh', { refreshToken }).then((response) => response.data);
  },
}; 