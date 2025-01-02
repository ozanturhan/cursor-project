'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from './ui/Button';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-neutral-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center font-medium">
              Logo
            </Link>
          </div>
          <div className="flex items-center">
            {session ? (
              <Link href={`/profile/${session.user.id}`}>
                <Button variant="ghost">Profile</Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 