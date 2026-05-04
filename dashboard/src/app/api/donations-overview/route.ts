import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const [summary, proofs, paymentsOverview] = await Promise.all([
      fetchExternalApi<{
        contractId: string;
        source: 'configured' | 'mock';
        totals: {
          hotspots: number;
          totalPiNeeded: number;
          totalPiDistributed: number;
          totalPeopleHelped: number;
        };
      }>('/contract-summary'),
      fetchExternalApi<{
        contractId: string;
        source: 'registration-log' | 'unconfigured';
        proofs: Array<unknown>;
      }>('/proofs'),
      fetchExternalApi<{
        source: 'file-store' | 'derived' | 'unavailable';
        totals: {
          intents: number;
          approved: number;
          completed: number;
          totalPi: number;
          completedPi: number;
          uniqueDonors: number;
        };
      }>('/pi-payments/overview'),
    ]);

    if (summary) {
      return NextResponse.json({
        source: 'derived',
        totals: {
          totalPiNeeded: summary.totals.totalPiNeeded,
          totalPiDistributed: summary.totals.totalPiDistributed,
          totalPeopleHelped: summary.totals.totalPeopleHelped,
          proofsCount: proofs?.proofs.length ?? 0,
          hotspotsCount: summary.totals.hotspots,
          paymentIntents: paymentsOverview?.totals.intents ?? 0,
          paymentCompletedPi: paymentsOverview?.totals.completedPi ?? 0,
          paymentUniqueDonors: paymentsOverview?.totals.uniqueDonors ?? 0,
        },
      });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json({
    source: 'unconfigured',
    totals: {
      totalPiNeeded: 0,
      totalPiDistributed: 0,
      totalPeopleHelped: 0,
      proofsCount: 0,
      hotspotsCount: 0,
      paymentIntents: 0,
      paymentCompletedPi: 0,
      paymentUniqueDonors: 0,
    },
  });
}
