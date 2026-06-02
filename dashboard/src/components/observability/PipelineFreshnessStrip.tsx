'use client';

import { Clock3, Database, Layers3, TimerReset } from 'lucide-react';
import { usePipelineAudit } from '@/hooks/usePipelineAudit';
import { formatDateTime, formatDurationMs, formatInteger } from '@/lib/formatters';

export function PipelineFreshnessStrip() {
  const { data } = usePipelineAudit();
  const cache = data?.audit.providers?.cache;

  const items = [
    {
      icon: Clock3,
      label: 'Última atualização',
      value: formatDateTime(data?.audit.generatedAt),
    },
    {
      icon: TimerReset,
      label: 'Tempo de build',
      value: formatDurationMs(data?.audit.durationMs),
    },
    {
      icon: Database,
      label: 'Cache entries',
      value: formatInteger(cache?.entries ?? 0),
    },
    {
      icon: Layers3,
      label: 'Model version',
      value: data?.audit.modelVersion ?? 'pfh-ml-pipeline-v6',
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-4 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.16)]">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <item.icon className="h-4 w-4 text-cyan-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
          </div>
          <p className="text-sm font-semibold leading-6 text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
