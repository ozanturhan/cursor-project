'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormControl } from '@/components/ui/FormControl';
import axios from 'axios';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/axios';

interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const debouncedUsername = useDebounce(username, 500);

  const { data: isUsernameTaken, isLoading: isCheckingUsername } = useQuery({
    queryKey: ['checkUsername', debouncedUsername],
    queryFn: async () => {
      if (!debouncedUsername || debouncedUsername.length < 3) return false;
      try {
        const response = await api.get(`/auth/check-username/${debouncedUsername}`);
        return !response.data.isAvailable;
      } catch (error) {
        return true;
      }
    },
    enabled: debouncedUsername.length >= 3,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterData) => api.post('/auth/register', data),
    onSuccess: () => {
      router.push('/auth/success/registration');
    },
    onError: (error: any) => {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        router.push('/auth/error/registration-failed');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
    };

    mutate(data);
  };

  const isUsernameValid = debouncedUsername.length >= 3 && !isUsernameTaken && !isCheckingUsername;

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Create an account</h1>
          <p className="mt-2 text-neutral-600">Join our consultation platform</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-error-500 bg-error-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormControl label="Full Name">
            <Input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              autoComplete="name"
              isDisabled={isPending}
              required
            />
          </FormControl>

          <FormControl 
            label="Username" 
            error={isUsernameTaken ? 'This username is already taken' : undefined}
            success={isUsernameValid ? 'Username is available' : undefined}
          >
            <Input
              type="text"
              name="username"
              placeholder="Choose a username"
              autoComplete="username"
              isDisabled={isPending}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isLoading={isCheckingUsername}
              isSuccess={isUsernameValid}
              required
            />
          </FormControl>

          <FormControl label="Email address">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              isDisabled={isPending}
              required
            />
          </FormControl>

          <FormControl label="Password">
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              isDisabled={isPending}
              required
            />
          </FormControl>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isPending}
          >
            Create account
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-neutral-600">Already have an account?</span>{' '}
          <Link
            href="/auth/login"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 