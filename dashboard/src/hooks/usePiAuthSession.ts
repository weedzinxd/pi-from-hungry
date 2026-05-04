'use client';

import { useMutation } from '@tanstack/react-query';

export interface PiAuthVerifyPayload {
  uid: string;
  username: string;
  accessToken: string;
}

export interface PiAuthSessionResponse {
  source: 'demo-verify' | 'unavailable';
  verified: boolean;
  session: {
    uid: string;
    username: string;
    scopes: string[];
    verifiedAt: string;
  } | null;
  note: string;
}

async function verifyPiAuth(payload: PiAuthVerifyPayload): Promise<PiAuthSessionResponse> {
  const response = await fetch('/api/pi-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to verify Pi auth: ${response.status}`);
  }

  return response.json() as Promise<PiAuthSessionResponse>;
}

export function usePiAuthSession() {
  return useMutation({
    mutationFn: verifyPiAuth,
  });
}
