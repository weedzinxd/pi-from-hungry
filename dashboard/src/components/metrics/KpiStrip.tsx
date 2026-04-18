import { HeartPulse, Target, Users, Wheat } from 'lucide-react';
import { MetricCard } from '@/components/ui/MetricCard';
import { formatNumber } from '@/lib/formatters';
import type { CrisisEvent } from '@/types/domain';

export function KpiStrip({ events }: { events: CrisisEvent[] }) {
  const items = [
    { icon: Users, label: 'Total Afetados', value: formatNumber(events.reduce((a, e) => a + e.affected, 0)), color: 'text-red-400' },
    { icon: HeartPulse, label: 'Já Ajudados', value: formatNumber(events.reduce((a, e) => a + e.peopleHelped, 0)), color: 'text-emerald-400' },
    { icon: Wheat, label: 'PI Distribuído', value: formatNumber(events.reduce((a, e) => a + e.piDistributed, 0)), color: 'text-yellow-400' },
    { icon: Target, label: 'GVC Ativos', value: events.filter((e) => e.gvcActive).length.toString(), color: 'text-cyan-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {items.map((item) => (
        <MetricCard key={item.label} icon={item.icon} label={item.label} value={item.value} colorClass={item.color} />
      ))}
    </div>
  );
}
