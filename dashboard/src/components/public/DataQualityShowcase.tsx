'use client';

import { Activity, BarChart3, Database, ShieldCheck } from 'lucide-react';
import { usePipelineAudit } from '@/hooks/usePipelineAudit';
import { formatDateTime, formatDurationMs, formatPercent } from '@/lib/formatters';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';

export function DataQualityShowcase() {
  const { data } = usePipelineAudit();
  const metrics = data?.audit.metrics;
  const cache = data?.audit.providers?.cache;

  const items = [
    { icon: ShieldCheck, label: 'Confidence média', value: formatPercent(metrics?.avgConfidenceScore ?? 0), color: 'text-emerald-400' },
    { icon: Activity, label: 'Anomalia térmica', value: formatPercent(metrics?.avgThermalAnomalyScore ?? 0), color: 'text-orange-400' },
    { icon: BarChart3, label: 'Stress econômico', value: formatPercent(metrics?.avgEconomicStressScore ?? 0), color: 'text-yellow-400' },
    { icon: Database, label: 'Cache entries', value: String(cache?.entries ?? 0), color: 'text-cyan-400' },
  ];

  return (
    <Panel>
      <PanelHeader title="Qualidade da camada de dados" subtitle="Sinais objetivos para explicar a robustez da demo" />
      <PanelBody className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <item.icon className={`mb-3 h-5 w-5 ${item.color}`} />
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="grid gap-3 lg:grid-cols-3 text-sm text-zinc-300">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">Último snapshot: <span className="font-semibold text-white">{formatDateTime(data?.audit.generatedAt)}</span></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">Tempo de build: <span className="font-semibold text-white">{formatDurationMs(data?.audit.durationMs)}</span></div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">Modelo ativo: <span className="font-semibold text-white">{data?.audit.modelVersion ?? 'pfh-ml-pipeline-v6'}</span></div>
        </div>
      </PanelBody>
    </Panel>
  );
}
