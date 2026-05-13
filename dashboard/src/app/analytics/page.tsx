'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, BrainCircuit } from 'lucide-react';
import { AnalyticsInsightsPanel } from '@/components/analytics/AnalyticsInsightsPanel';
import { AnalyticsTopSummary } from '@/components/analytics/AnalyticsTopSummary';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { InfoListPanel } from '@/components/public/InfoListPanel';
import { PageHero } from '@/components/public/PageHero';
import { SectionIntro } from '@/components/public/SectionIntro';
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
        <div className="mb-8">
          <PageHero
            eyebrow="Decision layer"
            title="Priority analytics"
            description="Visão agregada dos hotspots curados para apoiar leitura executiva, priorização operacional, comparação temporal e evolução metodológica com mais clareza visual."
            pills={
              <>
                <StatusPill label="analytics" tone="success" />
                <StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'pipeline' ? 'success' : 'warning'} />
              </>
            }
            right={
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-cyan-400">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Priority lens</span>
                </div>
                <p className="max-w-xs text-sm leading-6 text-zinc-300">Ótima página para explicar por que um hotspot sobe no ranking sem abrir todos os detalhes individuais.</p>
              </div>
            }
          />
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="mb-8">
          <AnalyticsTopSummary />
        </div>

        <div className="mb-8">
          <AnalyticsInsightsPanel />
        </div>

        <SectionIntro
          title="Ranking operacional"
          description="Ordenado por priority, risk e affected, com sinais climáticos e temporais para facilitar uma leitura comparativa sem precisar trocar de tela."
        />

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel>
            <PanelHeader title="Ranking operacional" subtitle="Ordenado por priority, risk e affected" right={<BarChart3 className="h-4 w-4 text-emerald-400" />} />
            <PanelBody className="space-y-3">
              {data?.ranking.length ? data.ranking.map((row, index) => (
                <div key={row.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">#{index + 1}</p>
                      <p className="mt-1 text-lg font-bold text-white">{row.location}</p>
                      <p className="text-sm text-zinc-500">{row.country}</p>
                    </div>
                    <StatusPill label={row.severity.toLowerCase()} tone={row.severity === 'CRITICAL' ? 'danger' : row.severity === 'HIGH' ? 'warning' : 'neutral'} />
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Priority</p><p className="mt-1 font-bold text-cyan-400">{formatPercent(row.operationalPriorityScore)}</p></div>
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Risk</p><p className="mt-1 font-bold text-yellow-400">{formatPercent(row.foodRiskScore)}</p></div>
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Confidence</p><p className="mt-1 font-bold text-emerald-400">{formatPercent(row.confidenceScore)}</p></div>
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Affected</p><p className="mt-1 font-bold text-white">{formatNumber(row.affected)}</p></div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Climate stress</p><p className="mt-1 font-bold text-orange-400">{formatPercent(row.climateStressScore)}</p></div>
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Precip anomaly</p><p className="mt-1 font-bold text-red-400">{formatPercent(row.precipitationAnomalyScore)}</p></div>
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">NDVI proxy</p><p className="mt-1 font-bold text-lime-400">{formatPercent(row.ndviProxy)}</p></div>
                    <div className="rounded-xl border border-zinc-800 bg-black/30 p-3"><p className="text-zinc-500">Risk delta</p><p className={`mt-1 font-bold ${row.riskDelta > 0 ? 'text-red-400' : row.riskDelta < 0 ? 'text-emerald-400' : 'text-zinc-300'}`}>{formatPercent(Math.abs(row.riskDelta))}{row.riskDelta > 0 ? ' ↑' : row.riskDelta < 0 ? ' ↓' : ''}</p></div>
                  </div>
                  <Link href={`/hotspots/${row.id}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">Abrir hotspot <ArrowRight className="h-4 w-4" /></Link>
                </div>
              )) : <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">Ranking indisponível.</div>}
            </PanelBody>
          </Panel>

          <InfoListPanel
            title="Leitura recomendada"
            subtitle="Como usar a página"
            items={[
              'Use esta rota para comparar hotspots sem abrir um por um.',
              'Leve o topo do ranking para apresentações e decisões operacionais.',
              'Cruce esta leitura com methodology, comparison e hotspot trend para explicabilidade.',
              'Próximo passo: combinar NDVI real, chuva histórica, conflito e preços.',
            ]}
            tone="cyan"
          />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
