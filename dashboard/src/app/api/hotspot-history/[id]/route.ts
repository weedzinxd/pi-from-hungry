import { NextResponse } from 'next/server';
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

  return NextResponse.json({ hotspotId: id, source: 'unavailable', trend: 'stable', points: [] }, { status: 200 });
}
