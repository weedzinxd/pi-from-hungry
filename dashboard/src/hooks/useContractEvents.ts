'use client';

import { useQuery } from '@tanstack/react-query';

export interface ContractEventsResponse {
  contractId: string;
  latestLedger: number;
  source: 'rpc' | 'fallback' | 'unconfigured';
  events: Array<Record<string, unknown>>;
}

async function fetchContractEvents(): Promise<ContractEventsResponse> {
  const response = await fetch('/api/contract-events?startLedger=0&limit=20', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load contract events: ${response.status}`);
  }

  return response.json() as Promise<ContractEventsResponse>;
}

export function useContractEvents() {
  return useQuery({
    queryKey: ['contract-events'],
    queryFn: fetchContractEvents,
    refetchInterval: 30_000,
  });
}
