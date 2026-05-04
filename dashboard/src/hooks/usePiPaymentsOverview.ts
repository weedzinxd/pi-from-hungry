'use client';

import { useQuery } from '@tanstack/react-query';

export interface PiPaymentsOverviewResponse {
  source: 'file-store' | 'derived' | 'unavailable';
  totals: {
    intents: number;
    approved: number;
    completed: number;
    totalPi: number;
    completedPi: number;
    uniqueDonors: number;
  };
}

async function fetchPiPaymentsOverview(): Promise<PiPaymentsOverviewResponse> {
  const response = await fetch('/api/pi-payments-overview', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load Pi payments overview: ${response.status}`);
  }
  return response.json() as Promise<PiPaymentsOverviewResponse>;
}

export function usePiPaymentsOverview() {
  return useQuery({
    queryKey: ['pi-payments-overview'],
    queryFn: fetchPiPaymentsOverview,
    refetchInterval: 30_000,
  });
}
