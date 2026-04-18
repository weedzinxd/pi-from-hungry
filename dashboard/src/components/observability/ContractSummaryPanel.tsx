import { Coins, HandHelping, MapPinned } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusPill } from '@/components/ui/StatusPill';
import { formatNumber } from '@/lib/formatters';
import type { ContractSummaryResponse } from '@/hooks/useContractSummary';

export function ContractSummaryPanel({
  data,
  isLoading,
}: {
  data?: ContractSummaryResponse;
  isLoading?: boolean;
}) {
  return (
    <Panel>
      <PanelHeader
        title="Resumo do contrato"
        subtitle="Totais agregados disponíveis para a UI"
        right={<StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'configured' ? 'success' : 'warning'} />}
      />
      <PanelBody>
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-lg bg-zinc-800/60" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            <MetricCard icon={MapPinned} label="Hotspots" value={String(data?.totals.hotspots ?? 0)} colorClass="text-cyan-400" />
            <MetricCard icon={Coins} label="PI necessário" value={formatNumber(data?.totals.totalPiNeeded ?? 0)} colorClass="text-yellow-400" />
            <MetricCard icon={HandHelping} label="Pessoas ajudadas" value={formatNumber(data?.totals.totalPeopleHelped ?? 0)} colorClass="text-emerald-400" />
          </div>
        )}
      </PanelBody>
    </Panel>
  );
}
