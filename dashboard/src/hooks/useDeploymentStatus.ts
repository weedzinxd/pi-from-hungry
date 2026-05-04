'use client';

import { useQuery } from '@tanstack/react-query';

export interface DeploymentStatusResponse {
  contractId: string;
  network: string;
  rpcUrl: string;
  source: 'deployment-file' | 'environment' | 'unconfigured';
  deployment: {
    wasmHash?: string;
    timestamp?: string;
    networkPassphrase?: string;
    ledger?: number;
  } | null;
}

async function fetchDeploymentStatus(): Promise<DeploymentStatusResponse> {
  const response = await fetch('/api/deployment-status', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load deployment status: ${response.status}`);
  }

  return response.json() as Promise<DeploymentStatusResponse>;
}

export function useDeploymentStatus() {
  return useQuery({
    queryKey: ['deployment-status'],
    queryFn: fetchDeploymentStatus,
    refetchInterval: 60_000,
  });
}
