import { NextResponse } from 'next/server';
import { loadLocalContractSummary, loadLocalPiPaymentsOverview, loadLocalProofs } from '@/lib/local-demo';
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

  const [summary, proofs, payments] = await Promise.all([
    loadLocalContractSummary(),
    loadLocalProofs(),
    loadLocalPiPaymentsOverview(),
  ]);

  return NextResponse.json({
    source: 'derived',
    totals: {
      totalPiNeeded: summary.totals.totalPiNeeded,
      totalPiDistributed: summary.totals.totalPiDistributed,
      totalPeopleHelped: summary.totals.totalPeopleHelped,
      proofsCount: proofs.proofs.length,
      hotspotsCount: summary.totals.hotspots,
      paymentIntents: payments.totals.intents,
      paymentCompletedPi: payments.totals.completedPi,
      paymentUniqueDonors: payments.totals.uniqueDonors,
    },
  });
}
