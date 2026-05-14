import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      hotspots: {
        active: 'demo' | 'detector' | 'pipeline';
        demoFile: string;
        detectorFile: string;
        pipelineFile?: string;
      };
      events: {
        indexedSnapshotAvailable: boolean;
        indexedEventsFile: string;
      };
      deployment: {
        deploymentFile: string;
        available: boolean;
      };
      pipeline: {
        auditFile: string;
        auditAvailable: boolean;
        modelVersion: string;
        currentClimateProvider: string;
        historicalClimateProvider: string;
        macroeconomicProvider: string;
        cacheLayer: string;
      };
    }>('/data-sources');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(
    {
      hotspots: {
        active: 'demo',
        demoFile: './data/demo-hotspots.json',
        detectorFile: './backend-ia/hotspots_detectados.json',
        pipelineFile: './data/curated-hotspots.json',
      },
      events: {
        indexedSnapshotAvailable: false,
        indexedEventsFile: './data/indexed-events.json',
      },
      deployment: {
        deploymentFile: './deployments/latest-deployment.json',
        available: false,
      },
      pipeline: {
        auditFile: './data/pipeline-source-audit.json',
        auditAvailable: false,
        modelVersion: 'pfh-ml-pipeline-v5',
        currentClimateProvider: 'open-meteo-forecast',
        historicalClimateProvider: 'open-meteo-archive',
        macroeconomicProvider: 'world-bank-open-data',
        cacheLayer: 'local-json-http-cache',
      },
    },
    { status: 200 },
  );
}
