import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface Availability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface AvailabilityCalendarProps {
  availabilities: Availability[];
  isOwnProfile: boolean;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function AvailabilityCalendar({ availabilities, isOwnProfile }: AvailabilityCalendarProps) {
  if (availabilities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-600 mb-4">No availability slots set yet.</p>
        {isOwnProfile && (
          <Link href="/profile/edit">
            <Button variant="secondary">Set Availability</Button>
          </Link>
        )}
      </div>
    );
  }

  // Sort availabilities by day of week
  const sortedAvailabilities = [...availabilities].sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {sortedAvailabilities.map((slot) => (
          <div
            key={slot.id}
            className="p-4 rounded-lg bg-neutral-100 flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-neutral-900">{DAYS[slot.dayOfWeek]}</div>
              <div className="text-neutral-600">
                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isOwnProfile && (
        <div className="flex justify-end">
          <Link href="/profile/edit">
            <Button variant="secondary">Edit Availability</Button>
          </Link>
        </div>
      )}
    </div>
  );
} 