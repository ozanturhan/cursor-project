import { redirect } from 'next/navigation';
import { api } from '@/lib/axios';
import { isAxiosError } from 'axios';

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const { token } = await searchParams;

  if (!token) {
    redirect('/auth/error/verification-failed');
  }

  try {
    await api.post('/auth/verify-email', { token });
    redirect('/auth/success/verification');
  } catch (error) {
    // Only redirect to error page if it's an API error
    if (isAxiosError(error)) {
      redirect('/auth/error/verification-failed');
    }
    // Re-throw other errors (like Next.js redirect errors)
    throw error;
  }
}