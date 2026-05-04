'use client';

import { Clock3, ExternalLink } from 'lucide-react';
import type { PiUserImpactResponse } from '@/hooks/usePiUserImpact';

export function PiPersonalTimeline({ impact }: { impact?: PiUserImpactResponse }) {
  const intents = impact?.latestIntents ?? [];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Personal timeline</h2>
          <p className="text-xs text-zinc-500">Atividade recente filtrada para o pioneiro ativo.</p>
        </div>
        <Clock3 className="h-4 w-4 text-cyan-400" />
      </div>
      <div className="space-y-2">
        {intents.length ? (
          intents.map((intent) => (
            <div key={intent.paymentId} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{intent.hotspotLabel}</p>
                  <p className="mt-1 text-xs text-zinc-500">{intent.amountPi.toFixed(2)} Pi • {intent.status}</p>
                  <p className="mt-1 text-[11px] text-zinc-600">{intent.completedAt ?? intent.approvedAt ?? intent.createdAt}</p>
                </div>
                <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-300">{intent.txid ? 'tx' : 'intent'}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-500">Sem atividade pessoal registrada ainda.</p>
        )}
      </div>
      <div className="mt-4 text-xs text-zinc-500">
        <span className="inline-flex items-center gap-1 text-cyan-400">
          <ExternalLink className="h-3 w-3" />
          Próximo passo: ligar cada item a provas e callbacks oficiais do Pi.
        </span>
      </div>
    </div>
  );
}
