import { redirect } from 'next/navigation';
import { api } from '@/lib/axios';
import { isAxiosError } from 'axios';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Await the asynchronous `searchParams`
  const { token } = await searchParams;

  if (!token) {
    redirect('/auth/error/verification-failed');
  }

  try {
    await api.post('/auth/verify-email', { token });
    redirect('/auth/success/verification');
  } catch (error) {
    // Handle API errors and redirect
    if (isAxiosError(error)) {
      redirect('/auth/error/verification-failed');
    }
    // Re-throw other unexpected errors
    throw error;
  }
}
