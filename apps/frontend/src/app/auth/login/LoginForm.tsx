'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormControl } from '@/components/ui/FormControl';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const result = await signIn('consultation-backend', {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'unverified') {
          router.push('/auth/error/verification-required');
        } else {
          setError('Invalid email or password');
        }
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900">Welcome back</h1>
          <p className="mt-2 text-neutral-600">Sign in to your account</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-error-500 bg-error-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormControl label="Email address" isRequired>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              isDisabled={isLoading}
            />
          </FormControl>

          <FormControl label="Password" isRequired>
            <Input
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              isDisabled={isLoading}
            />
          </FormControl>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
          >
            Sign in
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-neutral-600">Don't have an account?</span>{' '}
          <Link
            href="/auth/register"
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
} 