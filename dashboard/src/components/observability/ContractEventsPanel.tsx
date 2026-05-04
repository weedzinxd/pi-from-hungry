import { CheckCircle2, Clock3, FileCode2, XCircle } from 'lucide-react';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import type { ContractEventsResponse } from '@/hooks/useContractEvents';

function parsedField(event: Record<string, unknown>, field: string): string {
  const parsed = event.parsed;
  if (parsed && typeof parsed === 'object' && field in parsed) {
    return String((parsed as Record<string, unknown>)[field] ?? '');
  }
  return '';
}

export function ContractEventsPanel({
  data,
  isLoading,
}: {
  data?: ContractEventsResponse;
  isLoading?: boolean;
}) {
  const tone =
    data?.source === 'rpc' || data?.source === 'indexer'
      ? 'success'
      : data?.source === 'fallback'
        ? 'warning'
        : 'neutral';

  return (
    <Panel>
      <PanelHeader
        title="Eventos do contrato"
        subtitle="Últimos eventos observados pela camada API"
        right={<StatusPill label={data?.source ?? 'loading'} tone={tone} />}
      />
      <PanelBody>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded-lg bg-zinc-800/60" />
            ))}
          </div>
        ) : data?.events?.length ? (
          <div className="space-y-2">
            {data.events.slice(0, 6).map((event, index) => (
              <div key={String(event.id ?? index)} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <FileCode2 className="h-4 w-4" />
                    <span className="text-xs font-medium break-all">{parsedField(event, 'topicLabel') || 'unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {Boolean(event.inSuccessfulContractCall) ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-red-400" />
                    )}
                    <span className="text-[10px] text-zinc-500">ledger {String(event.ledger ?? 'n/a')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-zinc-500 break-all">
                  <Clock3 className="h-3.5 w-3.5" />
                  <span>{String(event.txHash ?? 'tx n/a')}</span>
                </div>
                <div className="mt-1 text-[10px] text-zinc-600 break-all">
                  raw topic: {parsedField(event, 'rawTopic') || 'n/a'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6 text-center text-sm text-zinc-500">
            Nenhum evento disponível ainda.
          </div>
        )}
      </PanelBody>
    </Panel>
  );
}
