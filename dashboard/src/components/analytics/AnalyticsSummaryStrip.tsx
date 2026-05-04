'use client';

import { AlertTriangle, BarChart3, Leaf, ShieldCheck } from 'lucide-react';
import { useAnalyticsOverview } from '@/hooks/useAnalyticsOverview';
import { formatPercent } from '@/lib/formatters';

export function AnalyticsSummaryStrip() {
  const { data } = useAnalyticsOverview();

  const items = [
    {
      icon: AlertTriangle,
      label: 'Avg risk',
      value: formatPercent(data?.totals.avgRisk ?? 0),
      color: 'text-yellow-400',
    },
    {
      icon: BarChart3,
      label: 'Avg priority',
      value: formatPercent(data?.totals.avgPriority ?? 0),
      color: 'text-cyan-400',
    },
    {
      icon: ShieldCheck,
      label: 'Avg confidence',
      value: formatPercent(data?.totals.avgConfidence ?? 0),
      color: 'text-emerald-400',
    },
    {
      icon: Leaf,
      label: 'Source',
      value: data?.source ?? 'loading',
      color: 'text-lime-400',
    },
  ];

  return (
    <div className="mb-6 grid gap-3 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <item.icon className={`mb-2 h-5 w-5 ${item.color}`} />
          <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
          <p className="text-xs text-zinc-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
