'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { MobileNavigation } from './MobileNavigation';
import { cn } from '@/lib/utils';

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={cn(
          "p-2 rounded-md",
          "text-muted dark:text-muted-dark",
          "hover:text-foreground dark:hover:text-foreground-dark",
          "hover:bg-muted/10 dark:hover:bg-muted-dark/10"
        )}
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background dark:bg-background-dark border-t border-border dark:border-border-dark py-4 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <MobileNavigation />
          </div>
        </div>
      )}
    </div>
  );
} 