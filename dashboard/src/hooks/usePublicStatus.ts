'use client';

import { useQuery } from '@tanstack/react-query';

export interface PublicStatusResponse {
  appName: string;
  network: {
    status: 'healthy' | 'degraded' | 'offline';
    latestLedger: number;
  };
  deployment: {
    contractId: string;
    source: 'deployment-file' | 'environment' | 'unconfigured';
  };
  data: {
    hotspotsSource: 'demo' | 'detector' | 'pipeline';
    indexedSnapshotAvailable: boolean;
    proofsCount: number;
    hotspotsCount?: number;
  };
}

async function fetchPublicStatus(): Promise<PublicStatusResponse> {
  const response = await fetch('/api/public-status', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load public status: ${response.status}`);
  }
  return response.json() as Promise<PublicStatusResponse>;
}

export function usePublicStatus() {
  return useQuery({
    queryKey: ['public-status'],
    queryFn: fetchPublicStatus,
    refetchInterval: 30_000,
  });
}
