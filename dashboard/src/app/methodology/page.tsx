'use client';

import { Beaker, BrainCircuit, Database, ShieldCheck, Zap } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const methodologyCards = [
  {
    icon: Database,
    title: 'Input layer',
    items: ['Detector de hotspots existente', 'Clima atual via Open-Meteo Forecast', 'Janela histórica via Open-Meteo Archive', 'Macroeconomia pública via World Bank Open Data', 'Metadata regional estruturada', 'Snapshot local de eventos e deployment'],
  },
  {
    icon: BrainCircuit,
    title: 'Scoring layer',
    items: ['foodRiskScore', 'climateStressScore', 'economicStressScore', 'operationalPriorityScore', 'confidenceScore', 'precipitationAnomalyScore', 'thermalAnomalyScore', 'dryDaysRatio', 'ndviProxy'],
  },
  {
    icon: ShieldCheck,
    title: 'Evidence layer',
    items: ['evidenceHash por hotspot', 'sourceModelVersion', 'computedAt', 'weatherSource + detector timestamp'],
  },
  {
    icon: Beaker,
    title: 'Next layer',
    items: ['NDVI real e anomalias climáticas', 'preços públicos de alimentos', 'camada de conflito', 'ranking analítico, movers e metodologia pública expandida'],
  },
];

export default function MethodologyPage() {
  const { data: networkStatus } = useNetworkStatus();

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-4xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="methodology" tone="success" />
            <StatusPill label="pipeline v5" tone="neutral" />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Methodology & scoring</h1>
          <p className="mt-4 text-zinc-400">
            Esta página explica a metodologia atual da demo pública: como hotspots são enriquecidos, como os scores são calculados e quais limites ainda existem antes de uma operação real.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {methodologyCards.map((card) => (
            <Panel key={card.title}>
              <PanelBody className="p-6">
                <card.icon className="mb-4 h-9 w-9 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">{card.title}</h2>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  {card.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="Scoring atual" subtitle="Fórmula transparente da demo v1" />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p>• climateStressScore combina temperatura, umidade inversa, vento, baixa precipitação instantânea, anomalia histórica, fração de dias secos e um proxy vegetal.</p>
              <p>• precipitationAnomalyScore usa janela matemática real: 30 dias recentes contra baseline equivalente de 90 dias.</p>
              <p>• thermalAnomalyScore mede aquecimento recente contra a média histórica curta da própria coordenada.</p>
              <p>• economicStressScore adiciona vulnerabilidade pública via PIB per capita e inflação do World Bank.</p>
              <p>• dryDaysRatio aumenta a sensibilidade quando a maior parte dos últimos dias teve precipitação baixa.</p>
              <p>• ndviProxy continua transparente como aproximação até a integração de NDVI real.</p>
              <p>• confidenceScore sobe quando temos clima atual + clima histórico + macroeconomia pública + metadata conhecida + detector consistente.</p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Limitações honestas" subtitle="Importante para credibilidade pública" />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p>• ainda não há NDVI satelital real, preços de alimentos dedicados ou conflito integrados nesta versão.</p>
              <p>• a série temporal atual é inicial e será fortalecida com snapshots sucessivos do pipeline.</p>
              <p>• a demo não substitui sistemas humanitários oficiais.</p>
              <p>• o pipeline atual é um passo intermediário entre mock e inteligência operacional séria.</p>
              <p>• o objetivo é evoluir para uma camada reproduzível, auditável e publicamente explicável.</p>
            </PanelBody>
          </Panel>
        </div>

        <div className="mt-8">
          <Panel>
            <PanelHeader title="Aquisição moderna" subtitle="Como a coleta ficou mais robusta" right={<Zap className="h-4 w-4 text-cyan-400" />} />
            <PanelBody className="grid gap-3 md:grid-cols-3 text-sm text-zinc-300">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">• cache local JSON para reduzir chamadas repetidas e acelerar rebuilds</div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">• TTL diferente para clima atual, histórico e macroeconomia pública</div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">• auditoria pública registra hits, misses e providers usados</div>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
