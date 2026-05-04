'use client';

import { useQuery } from '@tanstack/react-query';

export interface DataSourcesResponse {
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
}

async function fetchDataSources(): Promise<DataSourcesResponse> {
  const response = await fetch('/api/data-sources', {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to load data sources: ${response.status}`);
  }

  return response.json() as Promise<DataSourcesResponse>;
}

export function useDataSources() {
  return useQuery({
    queryKey: ['data-sources'],
    queryFn: fetchDataSources,
    refetchInterval: 60_000,
  });
}
