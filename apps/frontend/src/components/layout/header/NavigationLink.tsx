'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavigationLink({ href, children }: NavigationLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors duration-200',
        isActive
          ? 'text-primary-500 dark:text-primary-400'
          : 'text-muted dark:text-muted-dark hover:text-foreground dark:hover:text-foreground-dark'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
} 