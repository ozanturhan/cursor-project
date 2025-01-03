'use server';

import { api } from '@/lib/axios';
import { Profile } from '@/types';

export async function getProfile(username: string): Promise<Profile | null> {
  try {
    const response = await api.get(`/profile/${username}`);
    return response.data;
  } catch (error) {
    return null;
  }
}