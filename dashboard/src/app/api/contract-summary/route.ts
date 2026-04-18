import { NextResponse } from 'next/server';
import { mockCrisisEvents } from '@/lib/mock-data';

const contractId = process.env.CONTRACT_ID ?? process.env.NEXT_PUBLIC_CONTRACT_ID ?? '';

export async function GET() {
  const totalPiNeeded = mockCrisisEvents.reduce((acc, item) => acc + item.piNeeded, 0);
  const totalPiDistributed = mockCrisisEvents.reduce((acc, item) => acc + item.piDistributed, 0);
  const totalPeopleHelped = mockCrisisEvents.reduce((acc, item) => acc + item.peopleHelped, 0);

  return NextResponse.json({
    contractId,
    source: contractId ? 'configured' : 'mock',
    totals: {
      hotspots: mockCrisisEvents.length,
      totalPiNeeded,
      totalPiDistributed,
      totalPeopleHelped,
    },
  });
}
