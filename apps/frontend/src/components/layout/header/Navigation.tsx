import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

/**
 * Navigation items for the main header navigation
 */
const navigationItems = [
  { label: 'Home', href: '/' },
  { label: 'Browse Professionals', href: '/professionals' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const

/**
 * Main navigation component that displays the primary navigation links
 * in the header. Automatically highlights the active route.
 * 
 * @component
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */
export function Navigation() {
  const pathname = usePathname()

  return (
    <nav 
      className={cn(
        // Layout
        "hidden md:flex",
        // Spacing
        "items-center space-x-8"
      )}
      aria-label="Main navigation"
    >
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            // Typography
            'text-sm font-medium',
            // Colors & States
            pathname === item.href
              ? 'text-primary-600'
              : 'text-gray-600 hover:text-primary-600',
            // Transitions
            'transition-colors duration-200'
          )}
          aria-current={pathname === item.href ? 'page' : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
} 