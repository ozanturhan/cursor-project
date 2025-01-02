import { Layout } from '@/components/layout/Layout';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <main className="flex-1">
        {children}
      </main>
    </Layout>
  );
} 