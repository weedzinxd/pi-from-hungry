import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      source: 'file-store' | 'derived' | 'unavailable';
      totals: {
        intents: number;
        approved: number;
        completed: number;
        totalPi: number;
        completedPi: number;
        uniqueDonors: number;
      };
    }>('/pi-payments/overview');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json({
    source: 'unavailable',
    totals: { intents: 0, approved: 0, completed: 0, totalPi: 0, completedPi: 0, uniqueDonors: 0 },
  });
}
