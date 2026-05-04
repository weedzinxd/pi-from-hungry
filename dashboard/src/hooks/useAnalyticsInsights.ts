'use client';

import { useQuery } from '@tanstack/react-query';

export interface AnalyticsInsightsResponse {
  source: 'pipeline' | 'mixed' | 'unavailable';
  insights: {
    criticalCount: number;
    highPriorityCount: number;
    topHotspotId: string;
    topHotspotLabel: string;
    topMoverId: string;
    topMoverLabel: string;
  };
}

async function fetchAnalyticsInsights(): Promise<AnalyticsInsightsResponse> {
  const response = await fetch('/api/analytics-insights', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load analytics insights: ${response.status}`);
  }
  return response.json() as Promise<AnalyticsInsightsResponse>;
}

export function useAnalyticsInsights() {
  return useQuery({
    queryKey: ['analytics-insights'],
    queryFn: fetchAnalyticsInsights,
    refetchInterval: 60_000,
  });
}
