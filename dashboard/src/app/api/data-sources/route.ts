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
    },
    { status: 200 },
  );
}
