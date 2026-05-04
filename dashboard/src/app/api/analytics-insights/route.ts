import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      source: 'pipeline' | 'mixed' | 'unavailable';
      insights: {
        criticalCount: number;
        highPriorityCount: number;
        topHotspotId: string;
        topHotspotLabel: string;
        topMoverId: string;
        topMoverLabel: string;
      };
    }>('/analytics-insights');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json({
    source: 'unavailable',
    insights: {
      criticalCount: 0,
      highPriorityCount: 0,
      topHotspotId: '',
      topHotspotLabel: 'n/a',
      topMoverId: '',
      topMoverLabel: 'n/a',
    },
  }, { status: 200 });
}
