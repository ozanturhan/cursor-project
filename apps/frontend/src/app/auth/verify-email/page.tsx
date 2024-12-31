import { redirect } from 'next/navigation';
import { api } from '@/lib/axios';

export default async function VerifyEmailPage({
    searchParams,
  }: {
    searchParams: { token?: string };
  }) {
    if (!searchParams.token) {
      redirect('/auth/login');
    }
  
    const success = await api.post('/auth/verify-email', { 
      token: searchParams.token 
    })
      .then(() => true)
      .catch(() => false);
  
    redirect(success 
      ? '/auth/login?verified=true'
      : '/auth/login?error=verification_failed'
    );
  }