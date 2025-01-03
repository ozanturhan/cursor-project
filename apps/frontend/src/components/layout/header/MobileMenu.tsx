'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { MobileNavigation } from './MobileNavigation';

export function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
      >
        {isMenuOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-t border-neutral-200 py-4 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <MobileNavigation />
          </div>
        </div>
      )}
    </div>
  );
} 