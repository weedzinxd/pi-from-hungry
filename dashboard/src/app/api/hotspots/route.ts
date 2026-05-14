import { NextResponse } from 'next/server';
import { loadLocalHotspots } from '@/lib/local-demo';
import type { CrisisEvent } from '@/types/domain';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<CrisisEvent[]>('/hotspots');
    if (apiResponse) {
      return NextResponse.json(apiResponse, {
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }
  } catch {
    // Fallback below.
  }

  return NextResponse.json((await loadLocalHotspots()).hotspots, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
