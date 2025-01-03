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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Your Profile</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-500">Name</p>
                      <p className="text-neutral-900">{userData.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <p className="text-sm text-neutral-500">Email</p>
                      <p className="text-neutral-900">{userData.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <Link
                    href="/profile/edit"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Edit Profile
                  </Link>
                  <Link
                    href="/calendar"
                    className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Manage Calendar
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
