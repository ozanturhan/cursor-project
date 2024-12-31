'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormControl } from '@/components/ui/FormControl';
import axios from 'axios';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterData) => axios.post('/api/auth/register', data),
    onSuccess: () => {
      router.push('/auth/success/registration');
    },
    onError: (error: any) => {
      router.push('/auth/error/registration-failed');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      fullName: formData.get('fullName') as string,
    };

    mutate(data);
  };

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
          <FormControl label="Full Name" isRequired>
            <Input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              autoComplete="name"
              isDisabled={isPending}
            />
          </FormControl>

          <FormControl label="Email address" isRequired>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              isDisabled={isPending}
            />
          </FormControl>

          <FormControl label="Password" isRequired>
            <Input
              type="password"
              name="password"
              placeholder="Create a password"
              autoComplete="new-password"
              isDisabled={isPending}
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