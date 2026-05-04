'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface PiPaymentIntentActionResponse {
  source: 'file-store' | 'unavailable';
  intent: PiPaymentIntent | null;
  note: string;
}

export interface PiPaymentIntent {
  paymentId: string;
  hotspotId: string;
  hotspotLabel: string;
  amountPi: number;
  memo: string;
  donorUsername: string;
  status: 'draft' | 'pending_user_authorization' | 'pending_server_approval' | 'approved' | 'completed' | 'cancelled';
  createdAt: string;
  network: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  txid?: string | null;
  note?: string | null;
}

export interface PiPaymentIntentsResponse {
  source: 'file-store' | 'memory' | 'unavailable';
  intents: PiPaymentIntent[];
}

export interface CreatePiPaymentIntentPayload {
  hotspotId: string;
  hotspotLabel: string;
  amountPi: number;
  memo: string;
  donorUsername: string;
}

async function fetchPaymentIntents(): Promise<PiPaymentIntentsResponse> {
  const response = await fetch('/api/pi-payment-intents', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load Pi payment intents: ${response.status}`);
  }
  return response.json() as Promise<PiPaymentIntentsResponse>;
}

async function createPaymentIntent(payload: CreatePiPaymentIntentPayload): Promise<PiPaymentIntent> {
  const response = await fetch('/api/pi-payment-intents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create Pi payment intent: ${response.status}`);
  }

  return response.json() as Promise<PiPaymentIntent>;
}

async function runPaymentIntentAction(paymentId: string, action: 'approve' | 'complete'): Promise<PiPaymentIntentActionResponse> {
  const response = await fetch(`/api/pi-payment-intents/${paymentId}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Failed to ${action} Pi payment intent: ${response.status}`);
  }

  return response.json() as Promise<PiPaymentIntentActionResponse>;
}

export function usePiPaymentIntents() {
  return useQuery({
    queryKey: ['pi-payment-intents'],
    queryFn: fetchPaymentIntents,
    refetchInterval: 30_000,
  });
}

export function useCreatePiPaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pi-payment-intents'] });
    },
  });
}

export function useApprovePiPaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => runPaymentIntentAction(paymentId, 'approve'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pi-payment-intents'] });
      queryClient.invalidateQueries({ queryKey: ['pi-user-impact'] });
    },
  });
}

export function useCompletePiPaymentIntent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId: string) => runPaymentIntentAction(paymentId, 'complete'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pi-payment-intents'] });
      queryClient.invalidateQueries({ queryKey: ['pi-user-impact'] });
    },
  });
}
