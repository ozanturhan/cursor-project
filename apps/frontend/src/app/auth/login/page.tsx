'use client';

import { LoginForm } from './LoginForm';

interface LoginPageProps {
  searchParams: {
    message?: string;
    verified?: string;
    error?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const initialMessage = searchParams.verified 
    ? 'Your email has been successfully verified. You can now log in.'
    : searchParams.message;

  const initialError = searchParams.error === 'verification_failed'
    ? 'Email verification failed. The link may be invalid or expired. Please request a new verification email.'
    : undefined;

  return (
    <LoginForm 
      initialMessage={initialMessage} 
      initialError={initialError} 
    />
  );
} 