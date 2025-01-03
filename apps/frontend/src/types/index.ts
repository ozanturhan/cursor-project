export interface Profile {
  id: string;
  username: string;
  fullName: string;
  image?: string | null;
  profile: {
    id: string;
    bio?: string;
    title?: string;
    location?: string;
    profession?: string;
    hourlyRate?: string;
  } | null;
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  availability: Array<{
    id: string;
    dayOfWeek: number;
    startHour: number;
    endHour: number;
    startMinute: number;
    endMinute: number;
  }>;
}