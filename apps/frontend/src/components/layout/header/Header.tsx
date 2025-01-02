import { cn } from '@/lib/utils';
import { Navigation } from './Navigation';
import { AuthButton } from './AuthButton';

export async function Header() {
  return (
    <header className={cn(
      'sticky top-0 z-50 w-full',
      'border-b border-neutral-200',
      'bg-white/75 backdrop-blur-lg'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xl font-bold text-neutral-900">
              Logo
            </a>
            <Navigation />
          </div>
          {/* @ts-expect-error Async Server Component */}
          <AuthButton />
        </div>
      </div>
    </header>
  );
} 