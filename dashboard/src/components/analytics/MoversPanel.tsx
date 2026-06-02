'use client';

import Link from 'next/link';
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useMoversOverview } from '@/hooks/useMoversOverview';
import { formatPercent } from '@/lib/formatters';

export function MoversPanel() {
  const { data } = useMoversOverview();

  return (
    <Panel>
      <PanelHeader
        title="Top movers"
        subtitle="Hotspots com maior variação de risco"
        right={<StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'history-file' ? 'success' : 'warning'} />}
      />
      <PanelBody className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-400">
            <TrendingUp className="h-4 w-4" /> Em alta
          </div>
          <div className="space-y-3">
            {data?.topUp?.length ? data.topUp.map((row) => (
              <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{row.location}</p>
                    <p className="mt-1 text-xs text-zinc-500">{row.country}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">{formatPercent(row.riskDelta)}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-400">
                  <div className="rounded-lg border border-zinc-800 bg-black/30 p-2">Priority <span className="font-semibold text-white">{formatPercent(row.operationalPriorityScore)}</span></div>
                  <div className="rounded-lg border border-zinc-800 bg-black/30 p-2">Risk <span className="font-semibold text-white">{formatPercent(row.foodRiskScore)}</span></div>
                </div>
                <Link href={`/hotspots/${row.id}`} className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">Abrir <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            )) : <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">Sem variações positivas relevantes.</div>}
          </div>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
            <TrendingDown className="h-4 w-4" /> Em baixa
          </div>
          <div className="space-y-3">
            {data?.topDown?.length ? data.topDown.map((row) => (
              <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{row.location}</p>
                    <p className="mt-1 text-xs text-zinc-500">{row.country}</p>
                  </div>
                  <p className="text-sm font-bold text-red-400">{formatPercent(Math.abs(row.riskDelta))}</p>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-zinc-400">
                  <div className="rounded-lg border border-zinc-800 bg-black/30 p-2">Priority <span className="font-semibold text-white">{formatPercent(row.operationalPriorityScore)}</span></div>
                  <div className="rounded-lg border border-zinc-800 bg-black/30 p-2">Risk <span className="font-semibold text-white">{formatPercent(row.foodRiskScore)}</span></div>
                </div>
                <Link href={`/hotspots/${row.id}`} className="mt-3 inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300">Abrir <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            )) : <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">Sem reduções relevantes ainda.</div>}
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
