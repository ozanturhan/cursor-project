'use server';

import { api } from '@/lib/axios';

interface Profile {
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

export async function getProfile(username: string): Promise<Profile | null> {
  try {
    const response = await api.get(`/profile/${username}`);
    return response.data;
  } catch (error) {
    return null;
  }
}