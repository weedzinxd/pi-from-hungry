'use client';

import { useQuery } from '@tanstack/react-query';

export interface HotspotHistoryPoint {
  timestamp: string;
  foodRiskScore: number;
  operationalPriorityScore: number;
  confidenceScore: number;
  climateStressScore: number;
}

export interface HotspotHistoryResponse {
  hotspotId: string;
  source: 'history-file' | 'derived' | 'unavailable';
  trend: 'up' | 'down' | 'stable';
  points: HotspotHistoryPoint[];
}

async function fetchHotspotHistory(hotspotId: string): Promise<HotspotHistoryResponse> {
  const response = await fetch(`/api/hotspot-history/${hotspotId}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load hotspot history: ${response.status}`);
  }

  return response.json() as Promise<HotspotHistoryResponse>;
}

export function useHotspotHistory(hotspotId: string) {
  return useQuery({
    queryKey: ['hotspot-history', hotspotId],
    queryFn: () => fetchHotspotHistory(hotspotId),
    enabled: Boolean(hotspotId),
    refetchInterval: 60_000,
  });
}
