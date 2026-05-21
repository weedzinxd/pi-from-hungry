'use client';

import { AlertTriangle, Globe2, ShieldCheck, Waves } from 'lucide-react';
import { useHotspots } from '@/hooks/useHotspots';
import { formatNumber, formatPercent } from '@/lib/formatters';

export function HotspotsExecutiveStrip() {
  const { data: hotspots = [] } = useHotspots();
  const criticalCount = hotspots.filter((item) => item.severity === 'CRITICAL').length;
  const avgPriority = hotspots.length
    ? hotspots.reduce((acc, item) => acc + Number(item.analytics?.operationalPriorityScore ?? 0), 0) / hotspots.length
    : 0;
  const avgEconomicStress = hotspots.length
    ? hotspots.reduce((acc, item) => acc + Number(item.analytics?.economicStressScore ?? 0), 0) / hotspots.length
    : 0;
  const totalAffected = hotspots.reduce((acc, item) => acc + item.affected, 0);

  const items = [
    { icon: AlertTriangle, label: 'Críticos', value: String(criticalCount), color: 'text-red-400' },
    { icon: Waves, label: 'Priority média', value: formatPercent(avgPriority), color: 'text-cyan-400' },
    { icon: ShieldCheck, label: 'Stress econômico', value: formatPercent(avgEconomicStress), color: 'text-yellow-400' },
    { icon: Globe2, label: 'Afetados', value: formatNumber(totalAffected), color: 'text-white' },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
          <item.icon className={`mb-2 h-5 w-5 ${item.color}`} />
          <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
          <p className="mt-1 text-xs text-zinc-500">{item.label}</p>
        </div>
      ))}
    </div>
  );
}
