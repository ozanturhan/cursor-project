'use client';

import { Button } from '@/components/ui/Button';
import { FormControl } from '@/components/ui/FormControl';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
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
      fullName: formData.get('fullName') as string,
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      // Redirect to login page with success message
      router.push('/auth/login?message=Registration successful! Please check your email to verify your account.');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
              isDisabled={isLoading}
            />
          </FormControl>

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
              placeholder="Create a password"
              autoComplete="new-password"
              isDisabled={isLoading}
            />
          </FormControl>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
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