import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      source: 'audit-file' | 'unavailable';
      audit: {
        generatedAt?: string;
        modelVersion?: string;
        hotspotsCount?: number;
        durationMs?: number;
        providers?: Record<string, unknown>;
        metrics?: Record<string, unknown>;
      };
    }>('/pipeline-audit');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(
    {
      source: 'unavailable',
      audit: {
        modelVersion: 'pfh-ml-pipeline-v5',
        providers: {
          currentClimate: { name: 'Open-Meteo forecast' },
          historicalClimate: { name: 'Open-Meteo archive' },
          macroeconomics: { name: 'World Bank Open Data' },
          cache: { name: 'local-json-http-cache' },
        },
      },
    },
    { status: 200 },
  );
}
