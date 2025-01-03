import { NavigationLink } from './NavigationLink'

export function Navigation() {
  return (
    <nav className="flex items-center gap-8">
      <NavigationLink href="/">Home</NavigationLink>
      <NavigationLink href="/search">Find Experts</NavigationLink>
      <NavigationLink href="/about">About</NavigationLink>
    </nav>
  )
} 