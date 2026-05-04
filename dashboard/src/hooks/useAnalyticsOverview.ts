'use client';

import { useQuery } from '@tanstack/react-query';

export interface AnalyticsRow {
  id: string;
  location: string;
  country: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE';
  foodRiskScore: number;
  operationalPriorityScore: number;
  confidenceScore: number;
  climateStressScore: number;
  precipitationAnomalyScore: number;
  ndviProxy: number;
  riskDelta: number;
  affected: number;
  piNeeded: number;
}

export interface AnalyticsOverviewResponse {
  source: 'pipeline' | 'mixed' | 'unavailable';
  totals: {
    hotspots: number;
    avgConfidence: number;
    avgRisk: number;
    avgPriority: number;
    totalAffected: number;
    totalPiNeeded: number;
  };
  ranking: AnalyticsRow[];
}

async function fetchAnalyticsOverview(): Promise<AnalyticsOverviewResponse> {
  const response = await fetch('/api/analytics-overview', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load analytics overview: ${response.status}`);
  }
  return response.json() as Promise<AnalyticsOverviewResponse>;
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics-overview'],
    queryFn: fetchAnalyticsOverview,
    refetchInterval: 60_000,
  });
}
