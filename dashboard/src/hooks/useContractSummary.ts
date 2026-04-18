'use client';

import { useQuery } from '@tanstack/react-query';

export interface ContractSummaryResponse {
  contractId: string;
  source: 'configured' | 'mock';
  totals: {
    hotspots: number;
    totalPiNeeded: number;
    totalPiDistributed: number;
    totalPeopleHelped: number;
  };
}

async function fetchContractSummary(): Promise<ContractSummaryResponse> {
  const response = await fetch('/api/contract-summary', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load contract summary: ${response.status}`);
  }

  return response.json() as Promise<ContractSummaryResponse>;
}

export function useContractSummary() {
  return useQuery({
    queryKey: ['contract-summary'],
    queryFn: fetchContractSummary,
    refetchInterval: 30_000,
  });
}
