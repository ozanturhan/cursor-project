import { type Profile } from '@/types';
import { ClientTabs } from './ClientTabs';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h3 className="text-lg font-medium text-foreground dark:text-foreground-dark">About</h3>
          <p className="mt-2 text-muted dark:text-muted-dark">
            {profile.bio || 'No bio available.'}
          </p>
        </div>
      ),
    },
    {
      label: 'Availability',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground dark:text-foreground-dark">Availability</h3>
          <p className="text-muted dark:text-muted-dark">
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
    <div className="border-t border-border dark:border-border-dark">
      <ClientTabs tabs={tabs} />
    </div>
  );
} 