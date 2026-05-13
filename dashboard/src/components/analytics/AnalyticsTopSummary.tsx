'use client';

import { AlertTriangle, BarChart3, ShieldCheck, Users } from 'lucide-react';
import { useAnalyticsOverview } from '@/hooks/useAnalyticsOverview';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { PageMetricGrid } from '@/components/public/PageMetricGrid';

export function AnalyticsTopSummary() {
  const { data } = useAnalyticsOverview();

  return (
    <PageMetricGrid
      columns="xl:grid-cols-4"
      items={[
        { icon: Users, label: 'Hotspots', value: String(data?.totals.hotspots ?? 0), color: 'text-white' },
        { icon: ShieldCheck, label: 'Avg confidence', value: formatPercent(data?.totals.avgConfidence ?? 0), color: 'text-emerald-400' },
        { icon: AlertTriangle, label: 'Avg risk', value: formatPercent(data?.totals.avgRisk ?? 0), color: 'text-yellow-400' },
        { icon: BarChart3, label: 'Avg priority', value: formatPercent(data?.totals.avgPriority ?? 0), color: 'text-cyan-400' },
      ]}
    />
  );
}
