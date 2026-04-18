'use client';

import { useQuery } from '@tanstack/react-query';
import type { NetworkStatus } from '@/types/domain';

async function fetchNetworkStatus(): Promise<NetworkStatus> {
  const response = await fetch('/api/network-status', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load network status: ${response.status}`);
  }

  return response.json() as Promise<NetworkStatus>;
}

export function useNetworkStatus() {
  return useQuery({
    queryKey: ['network-status'],
    queryFn: fetchNetworkStatus,
    refetchInterval: 30_000,
  });
}
