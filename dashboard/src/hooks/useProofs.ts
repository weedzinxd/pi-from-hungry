'use client';

import { useQuery } from '@tanstack/react-query';

export interface ProofRecord {
  id: string;
  region: string;
  txHash: string;
  status: 'registered' | 'pending';
  network: string;
  recordedAt: string;
}

export interface ProofsResponse {
  contractId: string;
  source: 'registration-log' | 'unconfigured';
  proofs: ProofRecord[];
}

async function fetchProofs(): Promise<ProofsResponse> {
  const response = await fetch('/api/proofs', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load proofs: ${response.status}`);
  }

  return response.json() as Promise<ProofsResponse>;
}

export function useProofs() {
  return useQuery({
    queryKey: ['proofs'],
    queryFn: fetchProofs,
    refetchInterval: 30_000,
  });
}
