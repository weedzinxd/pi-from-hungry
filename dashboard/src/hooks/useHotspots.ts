'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardConfig } from '@/lib/config';
import { mockCrisisEvents } from '@/lib/mock-data';
import type { CrisisEvent } from '@/types/domain';

async function fetchHotspots(): Promise<CrisisEvent[]> {
  const response = await fetch('/api/hotspots', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load hotspots: ${response.status}`);
  }

  return response.json() as Promise<CrisisEvent[]>;
}

export function useHotspots() {
  return useQuery({
    queryKey: ['hotspots'],
    queryFn: async () => {
      try {
        return await fetchHotspots();
      } catch (error) {
        if (dashboardConfig.featureFlags.mockHotspotsFallback) {
          return mockCrisisEvents;
        }
        throw error;
      }
    },
  });
}
