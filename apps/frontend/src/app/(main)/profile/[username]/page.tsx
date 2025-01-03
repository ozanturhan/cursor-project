import { getProfile } from '@/app/actions/profile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth-provider';
import { notFound } from 'next/navigation';
import {
  ProfileHeader,
  ProfileTabs,
  AvailabilityCalendar,
  ClientTabs,
  SocialLinks
} from './_components';

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
    <div className="w-full sm:max-w-3xl mx-auto">
      <div className="bg-white sm:rounded-xl shadow-sm sm:shadow-sm ring-1 ring-neutral-200 overflow-hidden">
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