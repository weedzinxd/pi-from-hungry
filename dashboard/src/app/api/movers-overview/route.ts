import { NextResponse } from 'next/server';
import { loadLocalMoversOverview } from '@/lib/local-demo';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      source: 'history-file' | 'derived' | 'unavailable';
      topUp: Array<Record<string, unknown>>;
      topDown: Array<Record<string, unknown>>;
    }>('/movers-overview');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(await loadLocalMoversOverview(), { status: 200 });
}
