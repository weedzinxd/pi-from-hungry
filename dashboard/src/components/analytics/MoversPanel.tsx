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
                <p className="font-semibold text-white">{row.location}</p>
                <p className="mt-1 text-xs text-zinc-500">Δ risco {formatPercent(row.riskDelta)}</p>
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
                <p className="font-semibold text-white">{row.location}</p>
                <p className="mt-1 text-xs text-zinc-500">Δ risco {formatPercent(Math.abs(row.riskDelta))}</p>
                <Link href={`/hotspots/${row.id}`} className="mt-3 inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300">Abrir <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
            )) : <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">Sem reduções relevantes ainda.</div>}
          </div>
        </div>
      </PanelBody>
    </Panel>
  );
}
