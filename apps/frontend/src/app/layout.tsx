'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            let theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            }
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-page dark:bg-page-dark min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
