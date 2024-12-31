'use client';

import { Button } from '@/components/ui/Button';
import { FormControl } from '@/components/ui/FormControl';
import { Input } from '@/components/ui/Input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const message = searchParams.get('message');
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (message) setMessage(message);
    if (verified) {
      setMessage('Your email has been successfully verified. You can now log in.');
    }
    if (error === 'verification_failed') {
      setError('Email verification failed. The link may be invalid or expired. Please request a new verification email.');
    }
  }, [searchParams]);

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
          setError('Please verify your email before logging in. Check your inbox for the verification link.');
        } else {
          setError('Invalid email or password');
        }
        return;
      }

      // Redirect to the intended page or dashboard
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
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

        {message && (
          <div className="p-3 text-sm text-primary-500 bg-primary-50 rounded-md">
            {message}
          </div>
        )}

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