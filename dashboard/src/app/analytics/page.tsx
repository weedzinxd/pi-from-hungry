'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit } from 'lucide-react';
import { AnalyticsInsightsPanel } from '@/components/analytics/AnalyticsInsightsPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useAnalyticsOverview } from '@/hooks/useAnalyticsOverview';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { formatNumber, formatPercent } from '@/lib/formatters';

export default function AnalyticsPage() {
  const { data: networkStatus } = useNetworkStatus();
  const { data } = useAnalyticsOverview();

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-4xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="analytics" tone="success" />
            <StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'pipeline' ? 'success' : 'warning'} />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Priority analytics</h1>
          <p className="mt-4 text-zinc-400">
            Visão agregada dos hotspots curados para apoiar leitura executiva, priorização operacional e evolução metodológica.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[
            { label: 'Hotspots', value: String(data?.totals.hotspots ?? 0) },
            { label: 'Avg confidence', value: formatPercent(data?.totals.avgConfidence ?? 0) },
            { label: 'Avg risk', value: formatPercent(data?.totals.avgRisk ?? 0) },
            { label: 'Avg priority', value: formatPercent(data?.totals.avgPriority ?? 0) },
          ].map((item) => (
            <Panel key={item.label}><PanelBody className="p-5"><p className="text-xs text-zinc-500">{item.label}</p><p className="mt-2 text-2xl font-black text-white">{item.value}</p></PanelBody></Panel>
          ))}
        </div>

        <div className="mb-8">
          <AnalyticsInsightsPanel />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel>
            <PanelHeader title="Ranking operacional" subtitle="Ordenado por priority, risk e affected" right={<BarChart3 className="h-4 w-4 text-emerald-400" />} />
            <PanelBody className="space-y-3">
              {data?.ranking.length ? data.ranking.map((row, index) => (
                <div key={row.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-zinc-500">#{index + 1}</p>
                      <p className="font-bold text-white">{row.location}</p>
                      <p className="text-xs text-zinc-500">{row.country}</p>
                    </div>
                    <StatusPill label={row.severity.toLowerCase()} tone={row.severity === 'CRITICAL' ? 'danger' : row.severity === 'HIGH' ? 'warning' : 'neutral'} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div><p className="text-zinc-500">Priority</p><p className="font-bold text-cyan-400">{formatPercent(row.operationalPriorityScore)}</p></div>
                    <div><p className="text-zinc-500">Risk</p><p className="font-bold text-yellow-400">{formatPercent(row.foodRiskScore)}</p></div>
                    <div><p className="text-zinc-500">Confidence</p><p className="font-bold text-emerald-400">{formatPercent(row.confidenceScore)}</p></div>
                    <div><p className="text-zinc-500">Affected</p><p className="font-bold text-white">{formatNumber(row.affected)}</p></div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div><p className="text-zinc-500">Climate stress</p><p className="font-bold text-orange-400">{formatPercent(row.climateStressScore)}</p></div>
                    <div><p className="text-zinc-500">Precip anomaly</p><p className="font-bold text-red-400">{formatPercent(row.precipitationAnomalyScore)}</p></div>
                    <div><p className="text-zinc-500">NDVI proxy</p><p className="font-bold text-lime-400">{formatPercent(row.ndviProxy)}</p></div>
                    <div><p className="text-zinc-500">Risk delta</p><p className={`font-bold ${row.riskDelta > 0 ? 'text-red-400' : row.riskDelta < 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>{formatPercent(Math.abs(row.riskDelta))}{row.riskDelta > 0 ? ' ↑' : row.riskDelta < 0 ? ' ↓' : ''}</p></div>
                  </div>
                  <Link href={`/hotspots/${row.id}`} className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300">Abrir hotspot <ArrowRight className="h-4 w-4" /></Link>
                </div>
              )) : <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">Ranking indisponível.</div>}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Leitura recomendada" subtitle="Como usar a página" right={<BrainCircuit className="h-4 w-4 text-cyan-400" />} />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p>• Use esta rota para comparar hotspots sem abrir um por um.</p>
              <p>• Leve o topo do ranking para apresentações e decisões operacionais.</p>
              <p>• Cruce esta leitura com methodology, comparison e hotspot trend para explicabilidade.</p>
              <p>• Próximo passo: combinar NDVI real, chuva histórica, conflito e preços.</p>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
