import { NextResponse } from 'next/server';
import { loadLocalHotspotHistory } from '@/lib/local-demo';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const apiResponse = await fetchExternalApi<{
      hotspotId: string;
      source: 'history-file' | 'derived' | 'unavailable';
      trend: 'up' | 'down' | 'stable';
      points: Array<{
        timestamp: string;
        foodRiskScore: number;
        operationalPriorityScore: number;
        confidenceScore: number;
        climateStressScore: number;
      }>;
    }>(`/hotspot-history/${id}`);

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(await loadLocalHotspotHistory(id), { status: 200 });
}
