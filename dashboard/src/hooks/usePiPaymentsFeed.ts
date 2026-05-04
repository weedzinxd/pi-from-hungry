'use client';

import { useQuery } from '@tanstack/react-query';
import type { PiPaymentIntent } from '@/hooks/usePiPaymentIntents';

export interface PiPaymentsFeedResponse {
  source: 'file-store' | 'unavailable';
  feed: PiPaymentIntent[];
}

async function fetchPiPaymentsFeed(): Promise<PiPaymentsFeedResponse> {
  const response = await fetch('/api/pi-payments-feed', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load Pi payments feed: ${response.status}`);
  }
  return response.json() as Promise<PiPaymentsFeedResponse>;
}

export function usePiPaymentsFeed() {
  return useQuery({
    queryKey: ['pi-payments-feed'],
    queryFn: fetchPiPaymentsFeed,
    refetchInterval: 30_000,
  });
}
