'use client';

import Link from 'next/link'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/experts', label: 'Find Experts' },
  { href: '/about', label: 'About' },
]

export function MobileNavigation() {
  return (
    <nav className="flex flex-col space-y-2">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="text-neutral-600 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-50"
        >
          {label}
        </Link>
      ))}
    </nav>
  )
} 