'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { HotspotTrendPanel } from '@/components/charts/HotspotTrendPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useHotspots } from '@/hooks/useHotspots';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { formatNumber, formatPercent } from '@/lib/formatters';

export default function HotspotDetailsPage() {
  const params = useParams<{ id: string }>();
  const hotspotId = typeof params?.id === 'string' ? params.id : '';
  const { data: hotspots = [] } = useHotspots();
  const { data: networkStatus } = useNetworkStatus();

  const hotspot = useMemo(() => hotspots.find((item) => item.id === hotspotId) ?? null, [hotspots, hotspotId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-5xl px-4 py-12">
        <Link href="/hotspots" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Voltar para hotspots
        </Link>

        {!hotspot ? (
          <Panel>
            <PanelBody className="p-8 text-center text-zinc-400">Hotspot não encontrado na demo atual.</PanelBody>
          </Panel>
        ) : (
          <div className="space-y-4">
            <HotspotTrendPanel hotspotId={hotspot.id} />
            <Panel>
              <PanelHeader
                title={hotspot.location}
                subtitle={hotspot.country}
                right={<StatusPill label={hotspot.severity.toLowerCase()} tone={hotspot.severity === 'CRITICAL' ? 'danger' : hotspot.severity === 'HIGH' ? 'warning' : 'neutral'} />}
              />
              <PanelBody className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm text-zinc-300">{hotspot.description}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                    <MapPin className="h-4 w-4 text-emerald-400" />
                    <span>
                      {hotspot.region} • {hotspot.coordinates[0]}, {hotspot.coordinates[1]}
                    </span>
                  </div>
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">Pessoas afetadas</p>
                      <p className="mt-2 text-2xl font-black text-white">{formatNumber(hotspot.affected)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">Pessoas ajudadas</p>
                      <p className="mt-2 text-2xl font-black text-emerald-400">{formatNumber(hotspot.peopleHelped)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">PI necessário</p>
                      <p className="mt-2 text-2xl font-black text-yellow-400">{formatNumber(hotspot.piNeeded)}</p>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">PI distribuído</p>
                      <p className="mt-2 text-2xl font-black text-cyan-400">{formatNumber(hotspot.piDistributed)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {hotspot.analytics ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">Scores do pipeline</p>
                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-zinc-300">
                        <div>
                          <p className="text-zinc-500">Food risk</p>
                          <p className="font-bold text-white">{formatPercent(hotspot.analytics.foodRiskScore)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Climate stress</p>
                          <p className="font-bold text-white">{formatPercent(hotspot.analytics.climateStressScore)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Operational priority</p>
                          <p className="font-bold text-yellow-400">{formatPercent(hotspot.analytics.operationalPriorityScore)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Confidence</p>
                          <p className="font-bold text-emerald-400">{formatPercent(hotspot.analytics.confidenceScore)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Precip anomaly</p>
                          <p className="font-bold text-red-400">{formatPercent(hotspot.analytics.precipitationAnomalyScore ?? 0)}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">NDVI proxy</p>
                          <p className="font-bold text-lime-400">{formatPercent(hotspot.analytics.ndviProxy ?? 0)}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-zinc-500">{hotspot.analytics.sourceModelVersion} • {hotspot.analytics.computedAt}</p>
                    </div>
                  ) : null}
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Condição local</p>
                    <div className="mt-3 space-y-2 text-sm text-zinc-300">
                      <p>Temperatura: {hotspot.liveData.temperature}°C</p>
                      <p>Umidade: {hotspot.liveData.humidity}%</p>
                      <p>Vento: {hotspot.liveData.windSpeed} km/h</p>
                      <p>Seca: {hotspot.liveData.drought}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Notícia / contexto</p>
                    <p className="mt-3 text-sm text-zinc-300">{hotspot.news}</p>
                  </div>
                  {hotspot.evidence ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">Evidência / rastreabilidade</p>
                      <p className="mt-3 text-xs break-all text-zinc-300">Hash: {hotspot.evidence.evidenceHash}</p>
                      <p className="mt-2 text-xs text-zinc-500">Sources: {hotspot.evidence.sources.join(', ')}</p>
                    </div>
                  ) : null}
                  <Link
                    href={hotspot.satelliteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold text-white hover:border-emerald-500/40"
                  >
                    Abrir referência satelital <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </PanelBody>
            </Panel>
          </div>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
