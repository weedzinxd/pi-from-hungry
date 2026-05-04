'use client';

import { useQuery } from '@tanstack/react-query';
import type { PiPaymentIntent } from '@/hooks/usePiPaymentIntents';

export interface PiUserImpactResponse {
  source: 'file-store' | 'unavailable';
  username: string;
  totals: {
    intents: number;
    approved: number;
    completed: number;
    totalPi: number;
    completedPi: number;
  };
  badges: string[];
  latestIntents: PiPaymentIntent[];
}

async function fetchPiUserImpact(username: string): Promise<PiUserImpactResponse> {
  const response = await fetch(`/api/pi-my-impact?username=${encodeURIComponent(username)}`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load Pi user impact: ${response.status}`);
  }
  return response.json() as Promise<PiUserImpactResponse>;
}

export function usePiUserImpact(username: string) {
  return useQuery({
    queryKey: ['pi-user-impact', username],
    queryFn: () => fetchPiUserImpact(username),
    enabled: Boolean(username),
    refetchInterval: 30_000,
  });
}
