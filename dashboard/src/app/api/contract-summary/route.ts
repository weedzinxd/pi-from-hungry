import { NextResponse } from 'next/server';
import { loadLocalContractSummary } from '@/lib/local-demo';
import { mockCrisisEvents } from '@/lib/mock-data';
import { fetchExternalApi } from '@/lib/server-api';

const contractId = process.env.CONTRACT_ID ?? process.env.NEXT_PUBLIC_CONTRACT_ID ?? '';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      contractId: string;
      source: 'configured' | 'mock';
      totals: {
        hotspots: number;
        totalPiNeeded: number;
        totalPiDistributed: number;
        totalPeopleHelped: number;
      };
    }>('/contract-summary');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // Fallback below.
  }

  const local = await loadLocalContractSummary();
  const totalPiNeeded = mockCrisisEvents.reduce((acc, item) => acc + item.piNeeded, 0);
  const totalPiDistributed = mockCrisisEvents.reduce((acc, item) => acc + item.piDistributed, 0);
  const totalPeopleHelped = mockCrisisEvents.reduce((acc, item) => acc + item.peopleHelped, 0);

  return NextResponse.json({
    contractId: local.contractId || contractId,
    source: local.totals.hotspots ? local.source : contractId ? 'configured' : 'mock',
    totals: local.totals.hotspots
      ? local.totals
      : {
          hotspots: mockCrisisEvents.length,
          totalPiNeeded,
          totalPiDistributed,
          totalPeopleHelped,
        },
  });
}
