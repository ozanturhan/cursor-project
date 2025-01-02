import { Layout } from '@/components/layout/Layout';
import { Providers } from './providers';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'Consultation Platform',
  description: 'Connect with experts for personalized consultations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.className}>
      <body className="min-h-screen flex flex-col bg-neutral-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
