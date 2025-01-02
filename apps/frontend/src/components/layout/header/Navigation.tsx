import Link from 'next/link'
import { cn } from '@/lib/utils'
import { NavigationLink } from './NavigationLink'

const links = [
  { href: '/', label: 'Home' },
  { href: '/experts', label: 'Find Experts' },
  { href: '/about', label: 'About' },
]

export function Navigation() {
  return (
    <nav className="flex space-x-4">
      {links.map(({ href, label }) => (
        <NavigationLink key={href} href={href}>
          {label}
        </NavigationLink>
      ))}
    </nav>
  )
} 