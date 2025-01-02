import { ReactNode } from 'react'
import { Header } from './header/Header'
import { Footer } from './footer/Footer'

interface LayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export async function Layout({ children, showHeader = true, showFooter = true }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        /* @ts-expect-error Async Server Component */
        <Header />
      )}
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      {showFooter && <Footer />}
    </div>
  )
} 