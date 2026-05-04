import { NextResponse } from 'next/server';
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

  return NextResponse.json(
    {
      appName: 'Pi From Hungry',
      network: { status: 'offline', latestLedger: 0 },
      deployment: { contractId: '', source: 'unconfigured' },
      data: { hotspotsSource: 'demo', indexedSnapshotAvailable: false, proofsCount: 0, hotspotsCount: 0 },
    },
    { status: 200 },
  );
}
