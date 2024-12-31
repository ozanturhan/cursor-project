import { redirect } from 'next/navigation';
import { api } from '@/lib/axios';

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
  } catch (error: any) {
    redirect('/auth/error/verification-failed');
  }
}