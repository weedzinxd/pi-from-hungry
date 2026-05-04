'use client';

import { GitCompareArrows } from 'lucide-react';
import { AnalyticsInsightsPanel } from '@/components/analytics/AnalyticsInsightsPanel';
import { AnalyticsSummaryStrip } from '@/components/analytics/AnalyticsSummaryStrip';
import { MoversPanel } from '@/components/analytics/MoversPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function ComparisonPage() {
  const { data: networkStatus } = useNetworkStatus();

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-4xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="comparison" tone="success" />
            <StatusPill label="temporal view" tone="neutral" />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Temporal comparison</h1>
          <p className="mt-4 text-zinc-400">
            Página dedicada a observar variações de risco entre snapshots do pipeline e destacar hotspots que mais se moveram.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <AnalyticsSummaryStrip />
        <div className="mb-8">
          <AnalyticsInsightsPanel />
        </div>
        <MoversPanel />

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="Leitura temporal" subtitle="Como usar esta visão" right={<GitCompareArrows className="h-4 w-4 text-cyan-400" />} />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p>• Foque nos hotspots com riskDelta mais alto para priorização imediata.</p>
              <p>• Cruce a comparação com o trend panel de cada hotspot.</p>
              <p>• Use a página junto com analytics para decisões executivas.</p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Próxima evolução" subtitle="Para comparação ainda mais robusta" />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p>• adicionar snapshots históricos mais longos</p>
              <p>• comparar também NDVI real e precipitação histórica</p>
              <p>• destacar mudanças por região e cluster geográfico</p>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
