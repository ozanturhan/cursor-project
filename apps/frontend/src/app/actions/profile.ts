'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth-provider';
import { type Profile } from '@/types';
import { api } from '@/lib/axios';

export async function getProfile(): Promise<Profile | null> {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return null;
  }

  try {
    // Try to get the profile first
    const { data } = await api.get('/profile', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    // If profile exists, return it
    if (data) {
      return data;
    }

    // If profile doesn't exist, create it
    const { data: newProfile } = await api.put('/profile', {}, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    return newProfile;
  } catch (error) {
    console.error('Profile fetch error:', error);
    return null;
  }
}