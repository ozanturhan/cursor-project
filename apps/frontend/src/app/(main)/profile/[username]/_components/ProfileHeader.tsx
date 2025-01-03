import { type Profile } from '@/types';
import Image from 'next/image';
import { type Session } from 'next-auth';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  session: Session | null;
}

export function ProfileHeader({ profile, isOwnProfile, session }: ProfileHeaderProps) {
  return (
    <div>
      {/* Cover Image */}
      <div className="h-32 bg-primary-500" />

      {/* Profile Info Container */}
      <div className="px-3 sm:px-6">
        {/* Avatar */}
        <div className="relative -mt-16 mb-3">
          <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full ring-4 ring-white bg-white overflow-hidden">
            {profile.image ? (
              <Image
                src={profile.image}
                alt={session?.user?.name || profile.username}
                width={128}
                height={128}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-neutral-100 text-neutral-500">
                <svg
                  className="h-14 w-14 sm:h-16 sm:w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {session?.user?.name}
            </h1>
            <p className="text-sm text-neutral-500">@{session?.user?.username || profile.username}</p>
          </div>

          {isOwnProfile && (
            <button
              type="button"
              className="px-4 py-1.5 border border-neutral-300 rounded-full text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50"
            >
              Edit profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 