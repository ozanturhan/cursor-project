import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth-provider';
import { api } from '@/lib/axios';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

async function getUserData(accessToken: string) {
  try {
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function MainPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    redirect('/auth/login');
  }

  const userData = await getUserData(session.accessToken);
  
  if (!userData) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                Welcome back!
              </h1>
              <p className="text-lg text-neutral-600">
                {userData.email}
              </p>
            </div>

            <div className="mb-12">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Your Active Roles</h2>
              <div className="flex flex-wrap gap-2">
                {userData.roles.map((role: any) => (
                  <div
                    key={role.id}
                    className="px-4 py-2 bg-primary-50 border border-primary-200 text-primary-700 rounded-lg font-medium"
                  >
                    {role.role}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {userData.roles.some((r: any) => r.role === 'CLIENT') && (
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary-300 transition-colors">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Client Portal</h2>
                    <p className="text-neutral-600">
                      Schedule and manage your consultations with professionals
                    </p>
                  </div>
                  <Link href="/client/dashboard" className="block">
                    <Button variant="primary" fullWidth>
                      Access Client Dashboard
                    </Button>
                  </Link>
                </div>
              )}

              {userData.roles.some((r: any) => r.role === 'PROFESSIONAL') && (
                <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:border-primary-300 transition-colors">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-2">Professional Portal</h2>
                    <p className="text-neutral-600">
                      Manage your services, availability, and client appointments
                    </p>
                  </div>
                  <Link href="/professional/dashboard" className="block">
                    <Button variant="primary" fullWidth>
                      Access Professional Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
