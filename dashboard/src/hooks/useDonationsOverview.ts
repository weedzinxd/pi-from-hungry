'use client';

import { useQuery } from '@tanstack/react-query';

export interface DonationsOverviewResponse {
  source: 'derived' | 'unconfigured';
  totals: {
    totalPiNeeded: number;
    totalPiDistributed: number;
    totalPeopleHelped: number;
    proofsCount: number;
    hotspotsCount: number;
    paymentIntents: number;
    paymentCompletedPi: number;
    paymentUniqueDonors: number;
  };
}

async function fetchDonationsOverview(): Promise<DonationsOverviewResponse> {
  const response = await fetch('/api/donations-overview', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load donations overview: ${response.status}`);
  }

  return response.json() as Promise<DonationsOverviewResponse>;
}

export function useDonationsOverview() {
  return useQuery({
    queryKey: ['donations-overview'],
    queryFn: fetchDonationsOverview,
    refetchInterval: 30_000,
  });
}
