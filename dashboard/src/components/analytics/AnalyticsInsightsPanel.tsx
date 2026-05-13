'use client';

import Link from 'next/link';
import { ArrowUpRight, BrainCircuit, Siren, TrendingUp } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useAnalyticsInsights } from '@/hooks/useAnalyticsInsights';

export function AnalyticsInsightsPanel() {
  const { data } = useAnalyticsInsights();

  return (
    <Panel>
      <PanelHeader
        title="Insights executivos"
        subtitle="Resumo rápido da camada analítica"
        right={<StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'pipeline' ? 'success' : 'warning'} />}
      />
      <PanelBody className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-red-400">
            <Siren className="h-4 w-4" />
            <span className="text-sm font-semibold">Hotspots críticos</span>
          </div>
          <p className="text-2xl font-black text-white">{data?.insights.criticalCount ?? 0}</p>
          <p className="mt-1 text-xs leading-6 text-zinc-500">com severidade CRITICAL na fotografia atual</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-cyan-400">
            <BrainCircuit className="h-4 w-4" />
            <span className="text-sm font-semibold">Alta prioridade</span>
          </div>
          <p className="text-2xl font-black text-white">{data?.insights.highPriorityCount ?? 0}</p>
          <p className="mt-1 text-xs leading-6 text-zinc-500">hotspots com priority score acima do limiar operacional</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-yellow-400">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-sm font-semibold">Top hotspot</span>
          </div>
          <p className="font-bold text-white">{data?.insights.topHotspotLabel ?? 'n/a'}</p>
          {data?.insights.topHotspotId ? (
            <Link href={`/hotspots/${data.insights.topHotspotId}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300">
              Abrir hotspot <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">Top mover</span>
          </div>
          <p className="font-bold text-white">{data?.insights.topMoverLabel ?? 'n/a'}</p>
          {data?.insights.topMoverId ? (
            <Link href={`/hotspots/${data.insights.topMoverId}`} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
              Abrir hotspot <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>
      </PanelBody>
    </Panel>
  );
}
