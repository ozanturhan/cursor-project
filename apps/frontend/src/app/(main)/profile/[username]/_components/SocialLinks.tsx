import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  isOwnProfile: boolean;
}

const PLATFORM_ICONS: Record<string, string> = {
  TWITTER: '𝕏',
  LINKEDIN: 'in',
  GITHUB: '🐙',
  WEBSITE: '🌐',
};

export function SocialLinks({ links, isOwnProfile }: SocialLinksProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 mb-4">No social links added yet.</p>
        {isOwnProfile && (
          <Link href="/profile/edit">
            <Button variant="secondary">Add Social Links</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors"
          >
            <span className="mr-2">{PLATFORM_ICONS[link.platform] || '🔗'}</span>
            <span className="text-neutral-900">{link.platform.toLowerCase()}</span>
          </a>
        ))}
      </div>

      {isOwnProfile && (
        <div className="flex justify-end">
          <Link href="/profile/edit">
            <Button variant="secondary">Edit Social Links</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 