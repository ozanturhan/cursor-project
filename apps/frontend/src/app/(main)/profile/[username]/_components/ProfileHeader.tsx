import { Session } from 'next-auth';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

interface ProfileHeaderProps {
  profile: {
    id: string;
    username: string;
    fullName: string;
    image?: string | null;
  };
  isOwnProfile: boolean;
  session: Session | null;
}

export function ProfileHeader({ profile, isOwnProfile, session }: ProfileHeaderProps) {
  return (
    <div className="p-6 border-b border-neutral-200">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-neutral-100">
          {profile.image ? (
            <Image
              src={profile.image}
              alt={profile.fullName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-400">
              <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-neutral-900">{profile.fullName}</h1>
          <p className="text-neutral-500">@{profile.username}</p>
        </div>

        <div className="flex gap-2">
          {isOwnProfile ? (
            <Link href="/profile/edit">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          ) : session ? (
            <Button variant="primary">Schedule Meeting</Button>
          ) : (
            <Link href="/auth/login">
              <Button variant="primary">Login to Schedule</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 