'use client';

import { useParams } from 'next/navigation';

export default function ProfileNotFound() {
  const { username } = useParams();

  return (
    <div className="w-full sm:max-w-3xl mx-auto">
      <div className="bg-white sm:rounded-xl shadow-sm sm:shadow-sm ring-1 ring-neutral-200 overflow-hidden">
        {/* Profile Header Placeholder */}
        <div className="relative">
          <div className="bg-neutral-200 h-32 sm:h-48"></div>
          <div className="px-4 sm:px-6 pb-4">
            <div className="relative -mt-16 mb-3">
              <div className="relative h-32 w-32 rounded-full overflow-hidden bg-white ring-4 ring-white">
                <div className="h-full w-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                  <svg className="h-16 w-16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Username Display */}
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-neutral-900">@{username}</h1>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">This account doesn't exist</h1>
          <p className="text-neutral-600">Try searching for another.</p>
        </div>
      </div>
    </div>
  );
} 