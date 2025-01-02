import { type Profile } from '@/types';
import { ClientTabs } from './ClientTabs';
import { type ReactNode } from 'react';

interface ProfileTabsProps {
  profile: Profile;
  isOwnProfile: boolean;
}

export function ProfileTabs({ profile, isOwnProfile }: ProfileTabsProps) {
  const tabs: Array<{
    label: string;
    content: ReactNode;
  }> = [
    {
      label: 'About',
      content: (
        <div className="prose prose-neutral max-w-none">
          <h3 className="text-lg font-medium text-neutral-900">About</h3>
          <p className="mt-2 text-neutral-700">
            {profile.bio || 'No bio available.'}
          </p>
        </div>
      ),
    },
    {
      label: 'Social Links',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900">Social Links</h3>
          {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(profile.socialLinks) as Array<[string, string | undefined]>).map(
                ([platform, url]) =>
                  url && (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-neutral-700 hover:text-primary-500"
                    >
                      <span className="capitalize">{platform}</span>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )
              )}
            </div>
          ) : (
            <p className="text-neutral-500">No social links available.</p>
          )}
        </div>
      ),
    },
    {
      label: 'Availability',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-neutral-900">Availability</h3>
          <p className="text-neutral-500">
            {isOwnProfile
              ? 'Set your availability for consultations.'
              : 'View available consultation slots.'}
          </p>
          {/* TODO: Add availability calendar component */}
        </div>
      ),
    },
  ];

  return (
    <div className="border-t border-neutral-200">
      <ClientTabs tabs={tabs} />
    </div>
  );
} 