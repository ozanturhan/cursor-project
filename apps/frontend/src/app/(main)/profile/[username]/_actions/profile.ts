'use server';

import { api } from '@/lib/axios';
import { Profile } from '../_types/profile';

export async function getProfile(username: string): Promise<Profile | null> {
  try {
    const { data } = await api.get<Profile>(`/profile/${username}`);
    return data;
  } catch (error) {
    return null;
  }
}