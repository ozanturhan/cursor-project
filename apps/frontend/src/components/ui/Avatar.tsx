import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZES = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-24 w-24',
};

export function Avatar({ src, alt, size = 'md', className }: AvatarProps) {
  const sizeClasses = SIZES[size];

  if (!src) {
    // Placeholder avatar with initials
    const initials = alt
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-neutral-200 text-neutral-600 font-medium',
          sizeClasses,
          className
        )}
      >
        <span className={size === 'xl' ? 'text-2xl' : 'text-sm'}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative inline-block rounded-full overflow-hidden',
        sizeClasses,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`(max-width: 768px) ${size === 'xl' ? '96px' : '48px'}, ${
          size === 'xl' ? '96px' : '48px'
        }`}
      />
    </div>
  );
} 