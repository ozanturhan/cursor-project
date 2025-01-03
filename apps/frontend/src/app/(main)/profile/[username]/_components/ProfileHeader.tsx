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
    bio?: string;
    location?: string;
  };
  isOwnProfile: boolean;
  session: Session | null;
}

export function ProfileHeader({ profile, isOwnProfile, session }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image - We can add this later */}
      <div className="bg-neutral-200 h-32 sm:h-48"></div>
      
      {/* Profile Actions */}
      <div className="absolute right-4 top-36 sm:top-52 z-10">
        {isOwnProfile ? (
          <Link href="/profile/edit" className="block">
            <Button variant="outline" className="rounded-full w-full">
              Edit profile
            </Button>
          </Link>
        ) : session ? (
          <Link href={`/schedule/${profile.username}`} className="block">
            <Button variant="primary" className="rounded-full w-full">
              Schedule Meeting
            </Button>
          </Link>
        ) : (
          <Link href="/auth/login" className="block">
            <Button variant="primary" className="rounded-full w-full">
              Login to Schedule
            </Button>
          </Link>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-4 sm:px-6 pb-4">
        {/* Avatar */}
        <div className="relative -mt-16 mb-3">
          <div className="relative h-32 w-32 rounded-full overflow-hidden bg-white ring-4 ring-white">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={profile.fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-neutral-900">{profile.fullName}</h1>
          <p className="text-neutral-500">@{profile.username}</p>
          
          {/* Additional Info - We'll show these when available */}
          {profile.bio && (
            <p className="text-neutral-900 mt-3">{profile.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-3 text-neutral-500 text-sm">
            {profile.location && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 