import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { AuthButton } from './AuthButton';
import { MobileMenu } from './MobileMenu';

export async function Header() {
  return (
    <header className={cn(
      'sticky top-0 z-50 w-full',
      'border-b border-neutral-200',
      'bg-white/75 backdrop-blur-lg'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="text-xl font-bold text-neutral-900">
            Logo
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Navigation />
          </div>

          {/* Auth Button and Mobile Menu */}
          <div className="flex items-center gap-4">
            <AuthButton />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
} 