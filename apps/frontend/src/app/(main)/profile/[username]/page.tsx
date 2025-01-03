import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth-provider';
import { notFound } from 'next/navigation';
import {
  ProfileHeader,
  ProfileTabs,
} from './_components';
import { getProfile } from './_actions/profile';

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;
  const session = await getServerSession(authOptions);
  const profile = await getProfile(username);

  if (!profile) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === profile.id;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card dark:bg-card-dark sm:rounded-xl shadow-sm sm:shadow-sm ring-1 ring-border dark:ring-border-dark overflow-hidden">
        <ProfileHeader 
          profile={profile} 
          isOwnProfile={isOwnProfile} 
          session={session}
        />
        <ProfileTabs profile={profile} isOwnProfile={isOwnProfile} />
      </div>
    </div>
  );
} 