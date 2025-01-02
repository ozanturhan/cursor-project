import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Button } from '@/components/ui/Button';
import { authOptions } from '@/auth/auth-provider';

export async function AuthButton() {
  const session = await getServerSession(authOptions);

  if (session?.user?.username) {
    return (
      <Link href={`/profile/${session.user.username}`}>
        <Button variant="ghost">Profile</Button>
      </Link>
    );
  }

  return (
    <Link href="/auth/login">
      <Button variant="ghost">Sign in</Button>
    </Link>
  );
} 