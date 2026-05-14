'use client';

import { Database, RefreshCcw, ShieldCheck, TimerReset } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useDataSources } from '@/hooks/useDataSources';
import { usePipelineAudit } from '@/hooks/usePipelineAudit';
import { formatPercent } from '@/lib/formatters';

export function PipelineSourcesPanel() {
  const { data: sources } = useDataSources();
  const { data: audit } = usePipelineAudit();

  const cache = audit?.audit.providers?.cache;
  const metrics = audit?.audit.metrics;

  return (
    <Panel>
      <PanelHeader
        title="Data acquisition layer"
        subtitle="Sources, cache e qualidade do pipeline"
        right={<StatusPill label={sources?.pipeline.modelVersion ?? 'loading'} tone="success" />}
      />
      <PanelBody className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <Database className="mb-2 h-5 w-5 text-cyan-400" />
            <p className="text-sm font-semibold text-white">Current climate</p>
            <p className="mt-1 text-xs text-zinc-500">{sources?.pipeline.currentClimateProvider ?? 'open-meteo-forecast'}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <RefreshCcw className="mb-2 h-5 w-5 text-emerald-400" />
            <p className="text-sm font-semibold text-white">Historical climate</p>
            <p className="mt-1 text-xs text-zinc-500">{sources?.pipeline.historicalClimateProvider ?? 'open-meteo-archive'}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <ShieldCheck className="mb-2 h-5 w-5 text-yellow-400" />
            <p className="text-sm font-semibold text-white">Macroeconomics</p>
            <p className="mt-1 text-xs text-zinc-500">{sources?.pipeline.macroeconomicProvider ?? 'world-bank-open-data'}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <TimerReset className="mb-2 h-5 w-5 text-lime-400" />
            <p className="text-sm font-semibold text-white">Cache layer</p>
            <p className="mt-1 text-xs text-zinc-500">{sources?.pipeline.cacheLayer ?? 'local-json-http-cache'}</p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-white">Cache stats</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div><p className="text-zinc-500">Hits</p><p className="mt-1 text-lg font-bold text-emerald-400">{cache?.hits ?? 0}</p></div>
              <div><p className="text-zinc-500">Misses</p><p className="mt-1 text-lg font-bold text-yellow-400">{cache?.misses ?? 0}</p></div>
              <div><p className="text-zinc-500">Writes</p><p className="mt-1 text-lg font-bold text-cyan-400">{cache?.writes ?? 0}</p></div>
              <div><p className="text-zinc-500">Entries</p><p className="mt-1 text-lg font-bold text-white">{cache?.entries ?? 0}</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">
            <p className="font-semibold text-white">Quality snapshot</p>
            <div className="mt-3 space-y-2 text-xs">
              <p>Avg confidence: <span className="font-semibold text-emerald-400">{formatPercent(metrics?.avgConfidenceScore ?? 0)}</span></p>
              <p>Avg precip anomaly: <span className="font-semibold text-red-400">{formatPercent(metrics?.avgPrecipitationAnomalyScore ?? 0)}</span></p>
              <p>Avg thermal anomaly: <span className="font-semibold text-orange-400">{formatPercent(metrics?.avgThermalAnomalyScore ?? 0)}</span></p>
              <p>Avg economic stress: <span className="font-semibold text-yellow-400">{formatPercent(metrics?.avgEconomicStressScore ?? 0)}</span></p>
            </div>
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
