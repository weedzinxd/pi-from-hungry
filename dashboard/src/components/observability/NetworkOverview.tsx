import { Activity, Database, FileCode2 } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import type { NetworkStatus } from '@/types/domain';
import type { ContractEventsResponse } from '@/hooks/useContractEvents';
import type { ContractSummaryResponse } from '@/hooks/useContractSummary';

export function NetworkOverview({
  networkStatus,
  contractEvents,
  contractSummary,
}: {
  networkStatus?: NetworkStatus;
  contractEvents?: ContractEventsResponse;
  contractSummary?: ContractSummaryResponse;
}) {
  const networkTone =
    networkStatus?.status === 'healthy'
      ? 'success'
      : networkStatus?.status === 'degraded'
        ? 'warning'
        : 'danger';

  return (
    <Panel>
      <PanelHeader title="Visão operacional" subtitle="Rede, contrato e ingestão" />
      <PanelBody className="grid md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <Activity className="h-4 w-4" />
            <span className="text-sm font-medium">RPC / Ledger</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <StatusPill label={networkStatus?.status ?? 'offline'} tone={networkTone} />
          </div>
          <p className="text-xs text-zinc-500">Ledger atual: {networkStatus?.latestLedger ?? 0}</p>
          <p className="text-xs text-zinc-500 mt-1 break-all">{networkStatus?.rpcUrl ?? 'n/a'}</p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <FileCode2 className="h-4 w-4" />
            <span className="text-sm font-medium">Contrato</span>
          </div>
          <p className="text-xs text-zinc-500 break-all">{contractSummary?.contractId || 'não configurado'}</p>
          <p className="text-xs text-zinc-500 mt-1">Fonte: {contractSummary?.source ?? 'n/a'}</p>
          <p className="text-xs text-zinc-500 mt-1">Hotspots: {contractSummary?.totals.hotspots ?? 0}</p>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <Database className="h-4 w-4" />
            <span className="text-sm font-medium">Eventos</span>
          </div>
          <p className="text-xs text-zinc-500">Eventos carregados: {contractEvents?.events.length ?? 0}</p>
          <p className="text-xs text-zinc-500 mt-1">Último ledger observado: {contractEvents?.latestLedger ?? 0}</p>
          <p className="text-xs text-zinc-500 mt-1">Fonte: {contractEvents?.source ?? 'n/a'}</p>
        </div>
      </PanelBody>
    </Panel>
  );
}
