import { type Profile } from '@/types';
import { type Session } from 'next-auth';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { SocialLinks } from './SocialLinks';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  session: Session | null;
}

export function ProfileHeader({ profile, isOwnProfile, session }: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="bg-neutral-200 h-32 sm:h-48" />
      
      {/* Profile Content */}
      <div className="px-4">
        {/* Avatar and Action Button Row */}
        <div className="flex justify-between items-start">
          <div className="relative -mt-16">
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

          <div className="pt-4">
            {isOwnProfile ? (
              <Link href="/profile/edit">
                <Button variant="outline" className="rounded-full">
                  Edit profile
                </Button>
              </Link>
            ) : session ? (
              <Link href={`/schedule/${profile.username}`}>
                <Button variant="primary" className="rounded-full">
                  Schedule Meeting
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="primary" className="rounded-full">
                  Login to Schedule
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-3">
          <h1 className="text-xl font-bold text-neutral-900">{profile.fullName}</h1>
          <p className="text-neutral-500">@{profile.username}</p>
          
          {profile.bio && (
            <p className="mt-3 text-neutral-900">{profile.bio}</p>
          )}

          <div className="flex items-center gap-4 mt-3 text-neutral-600 text-sm">
            {profile.location && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{profile.location}</span>
              </div>
            )}
            {profile.company && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{profile.company}</span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <SocialLinks profile={profile} />
          </div>
        </div>
      </div>
    </div>
  );
} 