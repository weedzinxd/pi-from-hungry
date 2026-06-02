'use client';

import { ArrowDownRight, ArrowUpRight, ShieldCheck, Users } from 'lucide-react';
import { useAnalyticsOverview } from '@/hooks/useAnalyticsOverview';
import { useMoversOverview } from '@/hooks/useMoversOverview';
import { formatNumber, formatPercent } from '@/lib/formatters';

export function ComparisonExecutiveStrip() {
  const { data: analytics } = useAnalyticsOverview();
  const { data: movers } = useMoversOverview();

  const topUp = movers?.topUp?.[0];
  const topDown = movers?.topDown?.[0];

  const items = [
    {
      icon: ArrowUpRight,
      label: 'Top mover alta',
      value: topUp ? `${topUp.location} • ${formatPercent(topUp.riskDelta)}` : 'n/a',
      color: 'text-emerald-400',
    },
    {
      icon: ArrowDownRight,
      label: 'Top mover baixa',
      value: topDown ? `${topDown.location} • ${formatPercent(Math.abs(topDown.riskDelta))}` : 'n/a',
      color: 'text-red-400',
    },
    {
      icon: ShieldCheck,
      label: 'Priority média',
      value: formatPercent(analytics?.totals.avgPriority ?? 0),
      color: 'text-cyan-400',
    },
    {
      icon: Users,
      label: 'Afetados monitorados',
      value: formatNumber(analytics?.totals.totalAffected ?? 0),
      color: 'text-white',
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-4 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.16)]">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
          </div>
          <p className="text-sm font-semibold leading-6 text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
