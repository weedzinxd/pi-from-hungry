import { NextResponse } from 'next/server';
import { loadLocalAnalyticsOverview } from '@/lib/local-demo';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      source: 'pipeline' | 'mixed' | 'unavailable';
      totals: {
        hotspots: number;
        avgConfidence: number;
        avgRisk: number;
        avgPriority: number;
        totalAffected: number;
        totalPiNeeded: number;
      };
      ranking: Array<{
        id: string;
        location: string;
        country: string;
        severity: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE';
        foodRiskScore: number;
        operationalPriorityScore: number;
        confidenceScore: number;
        climateStressScore: number;
        precipitationAnomalyScore: number;
        ndviProxy: number;
        riskDelta: number;
        affected: number;
        piNeeded: number;
      }>;
    }>('/analytics-overview');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(await loadLocalAnalyticsOverview(), { status: 200 });
}
