import { NextResponse } from 'next/server';
import { loadLocalPiPaymentsOverview } from '@/lib/local-demo';
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

  return NextResponse.json(await loadLocalPiPaymentsOverview(), { status: 200 });
}
