'use client';

import { Beaker, BrainCircuit, Database, ShieldCheck } from 'lucide-react';
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
    items: ['Detector de hotspots existente', 'Clima atual via Open-Meteo', 'Metadata regional estruturada', 'Snapshot local de eventos e deployment'],
  },
  {
    icon: BrainCircuit,
    title: 'Scoring layer',
    items: ['foodRiskScore', 'climateStressScore', 'operationalPriorityScore', 'confidenceScore', 'precipitationAnomalyScore', 'ndviProxy'],
  },
  {
    icon: ShieldCheck,
    title: 'Evidence layer',
    items: ['evidenceHash por hotspot', 'sourceModelVersion', 'computedAt', 'weatherSource + detector timestamp'],
  },
  {
    icon: Beaker,
    title: 'Next layer',
    items: ['NDVI real e anomalias climáticas', 'séries históricas', 'camada de conflito', 'ranking analítico, movers e metodologia pública expandida'],
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
            <StatusPill label="pipeline v1" tone="neutral" />
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
              <p>• climateStressScore combina temperatura, umidade inversa, vento, baixa precipitação e um proxy vegetal.</p>
              <p>• precipitationAnomalyScore amplia a leitura de seca/irregularidade hídrica.</p>
              <p>• ndviProxy funciona como aproximação transparente da cobertura/estresse vegetal até a integração de NDVI real.</p>
              <p>• foodRiskScore combina detector score com climate stress e anomalia de precipitação.</p>
              <p>• operationalPriorityScore combina risco alimentar com dificuldade climática/operacional.</p>
              <p>• confidenceScore sobe quando temos clima externo válido, metadata conhecida e detector consistente.</p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Limitações honestas" subtitle="Importante para credibilidade pública" />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p>• ainda não há NDVI, preços de alimentos ou conflito integrados nesta versão.</p>
              <p>• a série temporal atual é inicial e será fortalecida com snapshots sucessivos do pipeline.</p>
              <p>• a demo não substitui sistemas humanitários oficiais.</p>
              <p>• o pipeline atual é um passo intermediário entre mock e inteligência operacional séria.</p>
              <p>• o objetivo é evoluir para uma camada reproduzível, auditável e publicamente explicável.</p>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
