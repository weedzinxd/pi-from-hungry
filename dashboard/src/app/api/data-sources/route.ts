import { NextResponse } from 'next/server';
import { loadLocalHotspots, loadLocalPipelineAudit } from '@/lib/local-demo';
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

  const localHotspots = await loadLocalHotspots();
  const localAudit = await loadLocalPipelineAudit();

  return NextResponse.json(
    {
      hotspots: {
        active: localHotspots.source,
        demoFile: './data/demo-hotspots.json',
        detectorFile: './backend-ia/hotspots_detectados.json',
        pipelineFile: './src/data/curated-hotspots.json',
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
        auditFile: './src/data/pipeline-source-audit.json',
        auditAvailable: localAudit.source === 'audit-file',
        modelVersion: String(localAudit.audit.modelVersion ?? 'pfh-ml-pipeline-v6'),
        currentClimateProvider: 'open-meteo-forecast',
        historicalClimateProvider: 'open-meteo-archive',
        macroeconomicProvider: 'world-bank-open-data',
        cacheLayer: 'local-json-http-cache',
      },
    },
    { status: 200 },
  );
}
