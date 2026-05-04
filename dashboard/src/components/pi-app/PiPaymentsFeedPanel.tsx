'use client';

import { Wallet } from 'lucide-react';
import { usePiPaymentsFeed } from '@/hooks/usePiPaymentsFeed';

export function PiPaymentsFeedPanel() {
  const { data } = usePiPaymentsFeed();

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Impact feed</h2>
          <p className="text-xs text-zinc-500">Fila recente de intents e conclusões do mini-app.</p>
        </div>
        <Wallet className="h-4 w-4 text-cyan-400" />
      </div>
      <div className="space-y-2">
        {data?.feed?.length ? data.feed.map((intent) => (
          <div key={intent.paymentId} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white">{intent.hotspotLabel}</p>
                <p className="mt-1 text-xs text-zinc-500">@{intent.donorUsername} • {intent.amountPi.toFixed(2)} Pi</p>
                <p className="mt-1 text-[11px] text-zinc-600">{intent.txid ?? intent.paymentId}</p>
              </div>
              <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-semibold text-zinc-300">{intent.status}</span>
            </div>
          </div>
        )) : <p className="text-sm text-zinc-500">Sem atividade recente no mini-app.</p>}
      </div>
    </div>
  );
}
