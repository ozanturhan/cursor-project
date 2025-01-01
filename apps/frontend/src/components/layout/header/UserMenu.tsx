import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * UserMenu component displays a dropdown menu for authenticated users
 * with options to view profile, access settings, and sign out.
 * 
 * @component
 * @example
 * ```tsx
 * <UserMenu user={{ name: "John Doe", email: "john@example.com" }} />
 * ```
 */
interface UserMenuProps {
  /** User object containing profile information */
  user: {
    /** User's display name */
    name?: string | null
    /** User's email address */
    email?: string | null
    /** URL to user's profile picture */
    image?: string | null
  }
}

interface MenuItemProps {
  active: boolean
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button 
          className={cn(
            // Layout
            "inline-flex w-full",
            // Spacing
            "gap-x-1",
            // Typography
            "text-sm font-medium",
            // Colors
            "text-gray-900",
            // States
            "hover:text-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-primary-500"
          )}
        >
          {user.name || user.email}
          <ChevronDownIcon 
            className={cn(
              // Layout
              "-mr-1 h-5 w-5",
              // Colors
              "text-gray-400",
              // States
              "group-hover:text-gray-500"
            )} 
            aria-hidden="true" 
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className={cn(
            // Layout
            "absolute right-0 z-10 w-56 origin-top-right",
            // Spacing
            "mt-2",
            // Colors
            "bg-white",
            // Visual
            "rounded-md shadow-lg ring-1 ring-black ring-opacity-5",
            // States
            "focus:outline-none"
          )}
        >
          <div className="py-1">
            <Menu.Item>
              {({ active }: MenuItemProps) => (
                <Link
                  href="/profile"
                  className={cn(
                    // Base
                    "block px-4 py-2 text-sm",
                    // Colors
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    // States
                    "hover:bg-gray-50"
                  )}
                >
                  View Profile
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: MenuItemProps) => (
                <Link
                  href="/settings"
                  className={cn(
                    // Base
                    "block px-4 py-2 text-sm",
                    // Colors
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    // States
                    "hover:bg-gray-50"
                  )}
                >
                  Settings
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }: MenuItemProps) => (
                <button
                  onClick={() => signOut()}
                  className={cn(
                    // Base
                    "block w-full text-left px-4 py-2 text-sm",
                    // Colors
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    // States
                    "hover:bg-gray-50"
                  )}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 