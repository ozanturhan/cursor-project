import { LoginForm } from './LoginForm';

interface LoginPageProps {
  searchParams: {
    message?: string;
    verified?: string;
    error?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { verified, message, error } = await searchParams;
  
  const initialMessage = verified 
    ? 'Your email has been successfully verified. You can now log in.'
    : message;

  const initialError = error === 'verification_failed'
    ? 'Email verification failed. The link may be invalid or expired. Please request a new verification email.'
    : undefined;

  return (
    <LoginForm 
      initialMessage={initialMessage} 
      initialError={initialError} 
    />
  );
} 