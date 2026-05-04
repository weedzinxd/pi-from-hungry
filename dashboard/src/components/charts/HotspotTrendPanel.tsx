'use client';

import { Activity } from 'lucide-react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useHotspotHistory } from '@/hooks/useHotspotHistory';

export function HotspotTrendPanel({ hotspotId }: { hotspotId: string }) {
  const { data, isLoading } = useHotspotHistory(hotspotId);

  const tone = data?.trend === 'up' ? 'danger' : data?.trend === 'down' ? 'success' : 'neutral';
  const chartData = (data?.points ?? []).map((point) => ({
    time: new Date(point.timestamp).toLocaleDateString('pt-BR', { month: 'short', day: '2-digit' }),
    risk: Number((point.foodRiskScore * 100).toFixed(1)),
    priority: Number((point.operationalPriorityScore * 100).toFixed(1)),
    confidence: Number((point.confidenceScore * 100).toFixed(1)),
  }));

  return (
    <Panel>
      <PanelHeader
        title="Trend do hotspot"
        subtitle={`Histórico ${data?.source ?? 'curado'} para leitura temporal`}
        right={<StatusPill label={data?.trend ?? 'loading'} tone={tone} />}
      />
      <PanelBody>
        {isLoading ? (
          <div className="h-56 animate-pulse rounded-xl bg-zinc-800/60" />
        ) : chartData.length ? (
          <div className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#09090b', border: '1px solid #27272a', borderRadius: 12 }}
                    labelStyle={{ color: '#fafafa' }}
                  />
                  <Line type="monotone" dataKey="risk" stroke="#facc15" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="priority" stroke="#22c55e" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="confidence" stroke="#06b6d4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Activity className="h-4 w-4" />
              <span>Linhas: risk (amarelo), priority (verde), confidence (ciano) • source: {data?.source ?? 'n/a'}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
            Histórico ainda indisponível para este hotspot.
          </div>
        )}
      </PanelBody>
    </Panel>
  );
}
