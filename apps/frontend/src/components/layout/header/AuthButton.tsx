import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth-provider';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export async function AuthButton() {
  const session = await getServerSession(authOptions);

  if (session?.user?.username) {
    return (
      <Link href={`/profile/${session.user.username}`}>
        <Button variant="outline" size="sm" className="rounded-full">
          Profile
        </Button>
      </Link>
    );
  }

  return (
    <Link href="/auth/login">
      <Button variant="primary" size="sm" className="rounded-full">
        Login
      </Button>
    </Link>
  );
} 