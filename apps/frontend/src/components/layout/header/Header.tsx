import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Navigation } from './Navigation'
import { UserMenu } from './UserMenu'
import { cn } from '@/lib/utils'

/**
 * Main header component that provides navigation and user-related actions.
 * Shows different content based on authentication state.
 * 
 * @component
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  const { data: session } = useSession()

  return (
    <header className={cn(
      // Layout
      "w-full",
      // Colors
      "bg-white",
      // Border
      "border-b border-gray-200"
    )}>
      <div className={cn(
        // Layout
        "container mx-auto",
        // Spacing
        "px-4"
      )}>
        <div className={cn(
          // Layout
          "flex items-center justify-between",
          // Sizing
          "h-16"
        )}>
          {/* Logo */}
          <Link 
            href="/" 
            className={cn(
              // Layout
              "flex items-center",
              // Spacing
              "space-x-2"
            )}
          >
            <span className={cn(
              // Typography
              "text-xl font-bold",
              // Colors
              "text-gray-900"
            )}>
              Consultation
            </span>
          </Link>

          {/* Main Navigation */}
          <Navigation />

          {/* Auth Section */}
          <div className={cn(
            // Layout
            "flex items-center",
            // Spacing
            "space-x-4"
          )}>
            {session ? (
              <UserMenu user={session.user} />
            ) : (
              <div className={cn(
                // Layout
                "flex items-center",
                // Spacing
                "space-x-4"
              )}>
                <Link
                  href="/auth/login"
                  className={cn(
                    // Colors & States
                    "text-gray-600 hover:text-gray-900",
                    // Transitions
                    "transition-colors duration-200"
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    // Base
                    "px-4 py-2 rounded-md",
                    // Colors
                    "bg-primary-600 text-white",
                    // States
                    "hover:bg-primary-700",
                    // Transitions
                    "transition-colors duration-200"
                  )}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 