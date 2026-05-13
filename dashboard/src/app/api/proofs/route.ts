import { NextResponse } from 'next/server';
import { loadLocalProofs } from '@/lib/local-demo';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      contractId: string;
      source: 'registration-log' | 'unconfigured';
      proofs: Array<{
        id: string;
        region: string;
        txHash: string;
        status: 'registered' | 'pending';
        network: string;
        recordedAt: string;
      }>;
    }>('/proofs');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(await loadLocalProofs(), { status: 200 });
}
