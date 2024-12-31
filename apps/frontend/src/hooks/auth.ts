import { authApi } from '@/api/auth';
import { AuthResponse, User } from '@/types/auth';
import { useMutation } from '@tanstack/react-query';

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

export function useRegister() {
  return useMutation<AuthResponse, Error, RegisterData>({
    mutationFn: (data) => authApi.register(data),
  });
}

export function useLogin() {
  return useMutation<AuthResponse, Error, LoginData>({
    mutationFn: (data) => authApi.login(data),
  });
} 