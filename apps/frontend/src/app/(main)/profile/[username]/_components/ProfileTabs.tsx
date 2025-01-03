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