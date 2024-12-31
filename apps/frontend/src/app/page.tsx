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
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome, {userData.fullName}</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Your Roles</h2>
          <div className="space-y-2">
            {userData.roles.map((role: any) => (
              <div key={role.id} className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                  {role.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userData.roles.some((r: any) => r.role === 'CLIENT') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Client Dashboard</h2>
              <p className="text-neutral-600 mb-4">
                Book consultations and manage your appointments
              </p>
              <Link href="/client/dashboard">
                <Button variant="primary">
                  Go to Client Dashboard
                </Button>
              </Link>
            </div>
          )}

          {userData.roles.some((r: any) => r.role === 'PROFESSIONAL') && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Professional Dashboard</h2>
              <p className="text-neutral-600 mb-4">
                Manage your services and availability
              </p>
              <Link href="/professional/dashboard">
                <Button variant="primary">
                  Go to Professional Dashboard
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
