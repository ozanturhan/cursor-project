import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Footer links configuration
 */
const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
] as const

const resourceLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'API Documentation', href: '/docs/api' },
] as const

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { label: 'GitHub', href: 'https://github.com', icon: 'github' },
] as const

/**
 * Footer component that displays company information, links, and social media.
 * 
 * @component
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  return (
    <footer className={cn(
      // Colors
      "bg-gray-50",
      // Border
      "border-t border-gray-200"
    )}>
      <div className={cn(
        // Layout
        "container mx-auto max-w-5xl",
        // Spacing
        "px-4 py-12"
      )}>
        <div className={cn(
          // Layout
          "grid grid-cols-1 md:grid-cols-4",
          // Spacing
          "gap-8"
        )}>
          {/* Brand */}
          <div>
            <h3 className={cn(
              // Typography
              "text-lg font-semibold",
              // Colors
              "text-gray-900"
            )}>
              Consultation
            </h3>
            <p className={cn(
              // Spacing
              "mt-4",
              // Typography
              "text-sm",
              // Colors
              "text-gray-600"
            )}>
              Connect with professionals for expert consultations.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className={cn(
              // Typography
              "text-sm font-semibold uppercase tracking-wider",
              // Colors
              "text-gray-900"
            )}>
              Company
            </h3>
            <ul className={cn(
              // Spacing
              "mt-4 space-y-4"
            )}>
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      // Typography
                      "text-sm",
                      // Colors & States
                      "text-gray-600 hover:text-gray-900",
                      // Transitions
                      "transition-colors duration-200"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className={cn(
              // Typography
              "text-sm font-semibold uppercase tracking-wider",
              // Colors
              "text-gray-900"
            )}>
              Resources
            </h3>
            <ul className={cn(
              // Spacing
              "mt-4 space-y-4"
            )}>
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      // Typography
                      "text-sm",
                      // Colors & States
                      "text-gray-600 hover:text-gray-900",
                      // Transitions
                      "transition-colors duration-200"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className={cn(
              // Typography
              "text-sm font-semibold uppercase tracking-wider",
              // Colors
              "text-gray-900"
            )}>
              Follow Us
            </h3>
            <ul className={cn(
              // Spacing
              "mt-4 space-y-4"
            )}>
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      // Typography
                      "text-sm",
                      // Colors & States
                      "text-gray-600 hover:text-gray-900",
                      // Transitions
                      "transition-colors duration-200"
                    )}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className={cn(
          // Spacing
          "mt-12 pt-8",
          // Border
          "border-t border-gray-200"
        )}>
          <p className={cn(
            // Typography
            "text-sm text-center",
            // Colors
            "text-gray-600"
          )}>
            © {new Date().getFullYear()} Consultation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
} 