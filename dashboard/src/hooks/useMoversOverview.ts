'use client';

import { useQuery } from '@tanstack/react-query';
import type { AnalyticsRow } from '@/hooks/useAnalyticsOverview';

export interface MoversOverviewResponse {
  source: 'history-file' | 'derived' | 'unavailable';
  topUp: AnalyticsRow[];
  topDown: AnalyticsRow[];
}

async function fetchMoversOverview(): Promise<MoversOverviewResponse> {
  const response = await fetch('/api/movers-overview', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load movers overview: ${response.status}`);
  }
  return response.json() as Promise<MoversOverviewResponse>;
}

export function useMoversOverview() {
  return useQuery({
    queryKey: ['movers-overview'],
    queryFn: fetchMoversOverview,
    refetchInterval: 60_000,
  });
}
