import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Metadata, Viewport } from 'next';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1019' },
  ],
};

export const metadata: Metadata = {
  title: 'Expert Consultation Platform',
  description: 'Connect with expert consultants for professional guidance',
};

// This template literal will be evaluated at build time and injected into the HTML
const criticalCss = `
  :root {
    color-scheme: light;
    --background: 255 255 255;
    --foreground: 10 16 25;
  }
  
  .dark {
    color-scheme: dark;
    --background: 10 16 25;
    --foreground: 255 255 255;
  }

  body {
    background-color: rgb(var(--background));
    color: rgb(var(--foreground));
  }
` as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  let theme = localStorage.getItem('theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    localStorage.setItem('theme', theme);
                  }
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
