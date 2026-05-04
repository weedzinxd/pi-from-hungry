'use client';

import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useHotspots } from '@/hooks/useHotspots';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export default function HotspotsPage() {
  const { data: hotspots = [], isLoading } = useHotspots();
  const { data: networkStatus } = useNetworkStatus();

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="hotspots" tone="success" />
            <StatusPill label={isLoading ? 'loading' : `${hotspots.length} loaded`} tone={isLoading ? 'warning' : 'neutral'} />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Hotspots ativos</h1>
          <p className="mt-4 text-zinc-400">
            Lista pública dos focos carregados na demo atual, com contexto operacional resumido e navegação para detalhes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hotspots.map((event) => (
            <Panel key={event.id}>
              <PanelHeader
                title={event.location}
                subtitle={event.country}
                right={<StatusPill label={event.severity.toLowerCase()} tone={event.severity === 'CRITICAL' ? 'danger' : event.severity === 'HIGH' ? 'warning' : 'neutral'} />}
              />
              <PanelBody className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>{event.region}</span>
                </div>
                <p className="text-sm text-zinc-300">{event.description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 col-span-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-zinc-500">Risk</p>
                        <p className="mt-1 font-bold text-white">{event.analytics ? formatPercent(event.analytics.foodRiskScore) : 'n/a'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Confidence</p>
                        <p className="mt-1 font-bold text-emerald-400">{event.analytics ? formatPercent(event.analytics.confidenceScore) : 'n/a'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Priority</p>
                        <p className="mt-1 font-bold text-cyan-400">{event.analytics ? formatPercent(event.analytics.operationalPriorityScore) : 'n/a'}</p>
                      </div>
                      <div>
                        <p className="text-zinc-500">Climate stress</p>
                        <p className="mt-1 font-bold text-orange-400">{event.analytics ? formatPercent(event.analytics.climateStressScore) : 'n/a'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <p className="text-zinc-500">Afetados</p>
                    <p className="mt-1 font-bold text-white">{formatNumber(event.affected)}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                    <p className="text-zinc-500">Ajudados</p>
                    <p className="mt-1 font-bold text-emerald-400">{formatNumber(event.peopleHelped)}</p>
                  </div>
                </div>
                <Link
                  href={`/hotspots/${event.id}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 font-bold text-black"
                >
                  Ver detalhes <ArrowRight className="h-4 w-4" />
                </Link>
              </PanelBody>
            </Panel>
          ))}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
