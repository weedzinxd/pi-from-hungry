import { NextResponse } from 'next/server';
import { loadLocalPublicStatus } from '@/lib/local-demo';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      appName: string;
      network: { status: 'healthy' | 'degraded' | 'offline'; latestLedger: number };
      deployment: { contractId: string; source: 'deployment-file' | 'environment' | 'unconfigured' };
      data: { hotspotsSource: 'demo' | 'detector' | 'pipeline'; indexedSnapshotAvailable: boolean; proofsCount: number; hotspotsCount?: number };
    }>('/public-status');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(await loadLocalPublicStatus(), { status: 200 });
}
