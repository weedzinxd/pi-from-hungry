'use client';

import { useQuery } from '@tanstack/react-query';

export interface PipelineAuditResponse {
  source: 'audit-file' | 'unavailable';
  audit: {
    generatedAt?: string;
    modelVersion?: string;
    hotspotsCount?: number;
    durationMs?: number;
    providers?: {
      cache?: { hits?: number; misses?: number; writes?: number; entries?: number };
      currentClimate?: { name?: string; successCount?: number; fallbackCount?: number };
      historicalClimate?: { name?: string; successCount?: number; fallbackCount?: number; window?: string };
      macroeconomics?: { name?: string; successCount?: number; fallbackCount?: number };
    };
    metrics?: {
      avgConfidenceScore?: number;
      avgPrecipitationAnomalyScore?: number;
      avgThermalAnomalyScore?: number;
      avgEconomicStressScore?: number;
    };
  };
}

async function fetchPipelineAudit(): Promise<PipelineAuditResponse> {
  const response = await fetch('/api/pipeline-audit', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load pipeline audit: ${response.status}`);
  }
  return response.json() as Promise<PipelineAuditResponse>;
}

export function usePipelineAudit() {
  return useQuery({
    queryKey: ['pipeline-audit'],
    queryFn: fetchPipelineAudit,
    refetchInterval: 120_000,
  });
}
