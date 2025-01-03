import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { AuthButton } from './AuthButton';
import { MobileMenu } from './MobileMenu';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export async function Header() {
  return (
    <header className={cn(
      'sticky top-0 z-50 w-full',
      'border-b border-border dark:border-border-dark',
      'bg-background/75 dark:bg-background-dark/75 backdrop-blur-lg'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-lg font-semibold text-foreground dark:text-foreground-dark">Expert Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Navigation />
          </div>

          {/* Auth Button, Theme Switcher, and Mobile Menu */}
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
} 