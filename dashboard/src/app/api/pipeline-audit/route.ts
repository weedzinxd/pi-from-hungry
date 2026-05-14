import { NextResponse } from 'next/server';
import { loadLocalPipelineAudit } from '@/lib/local-demo';
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

  return NextResponse.json(await loadLocalPipelineAudit(), { status: 200 });
}
