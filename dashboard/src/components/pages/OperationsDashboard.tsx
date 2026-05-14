'use client';

import { useEffect, useMemo, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { CrisisFeed } from '@/components/feeds/CrisisFeed';
import { ImpactHero } from '@/components/hero/ImpactHero';
import { CrisisMap, LeafletCSS } from '@/components/map/CrisisMap';
import { KpiStrip } from '@/components/metrics/KpiStrip';
import { AnalyticsSummaryStrip } from '@/components/analytics/AnalyticsSummaryStrip';
import { MoversPanel } from '@/components/analytics/MoversPanel';
import { PiPaymentsOverviewPanel } from '@/components/pi-app/PiPaymentsOverviewPanel';
import { ContractEventsPanel } from '@/components/observability/ContractEventsPanel';
import { ContractSummaryPanel } from '@/components/observability/ContractSummaryPanel';
import { NetworkOverview } from '@/components/observability/NetworkOverview';
import { PipelineSourcesPanel } from '@/components/observability/PipelineSourcesPanel';
import { DetailsPanel } from '@/components/panels/DetailsPanel';
import { SatelliteSection } from '@/components/panels/SatelliteSection';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { useContractEvents } from '@/hooks/useContractEvents';
import { useContractSummary } from '@/hooks/useContractSummary';
import { useHotspots } from '@/hooks/useHotspots';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export function OperationsDashboard() {
  const { data: hotspots = [], isLoading } = useHotspots();
  const { data: networkStatus } = useNetworkStatus();
  const { data: contractEvents, isLoading: isLoadingContractEvents } = useContractEvents();
  const { data: contractSummary, isLoading: isLoadingContractSummary } = useContractSummary();
  const events = useMemo(() => hotspots, [hotspots]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedEventId && events.length > 0) {
      setSelectedEventId(events[0].id);
    }
  }, [events, selectedEventId]);

  const selectedEvent = selectedEventId ? events.find((e) => e.id === selectedEventId) ?? null : null;

  return (
    <div className="min-h-screen bg-black text-white">
      <LeafletCSS />
      <AppHeader networkStatus={networkStatus} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        {isLoading && events.length === 0 ? (
          <div className="mb-4 grid gap-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : null}

        <NetworkOverview
          networkStatus={networkStatus}
          contractEvents={contractEvents}
          contractSummary={contractSummary}
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ContractSummaryPanel data={contractSummary} isLoading={isLoadingContractSummary} />
          <ContractEventsPanel data={contractEvents} isLoading={isLoadingContractEvents} />
        </div>

        <div className="mt-4">
          <PipelineSourcesPanel />
        </div>

        <div className="h-6" />

        <ImpactHero events={events} />
        <AnalyticsSummaryStrip />
        <div className="mb-6">
          <PiPaymentsOverviewPanel />
        </div>
        <KpiStrip events={events} />
        <div className="mb-6">
          <MoversPanel />
        </div>

        {events.length === 0 && !isLoading ? (
          <EmptyState
            icon={WifiOff}
            title="Nenhum hotspot disponível"
            description="A API ainda não retornou hotspots. Verifique a ingestão de dados, o indexador e a configuração do backend."
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <CrisisMap events={events} selectedId={selectedEventId} onSelect={setSelectedEventId} />
              <SatelliteSection event={selectedEvent} />
            </div>
            <div className="space-y-4">
              <DetailsPanel event={selectedEvent} />
              <CrisisFeed events={events} selectedEventId={selectedEventId} onSelect={setSelectedEventId} />
            </div>
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-5 shadow-[0_10px_35px_-20px_rgba(16,185,129,0.18)]">
          <div className="flex flex-wrap gap-2 justify-center">
            {['Pi Network', 'NASA FIRMS', 'Soroban', 'React Query', 'Next.js', 'FastAPI'].map((t) => (
              <span key={t} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                {t}
              </span>
            ))}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
