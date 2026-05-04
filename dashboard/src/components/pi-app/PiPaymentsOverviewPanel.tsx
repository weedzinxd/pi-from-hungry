'use client';

import { Coins, Users, Wallet } from 'lucide-react';
import { usePiPaymentsOverview } from '@/hooks/usePiPaymentsOverview';

export function PiPaymentsOverviewPanel() {
  const { data } = usePiPaymentsOverview();

  const cards = [
    { icon: Wallet, label: 'Intents', value: String(data?.totals.intents ?? 0), color: 'text-cyan-300' },
    { icon: Coins, label: 'Completed Pi', value: (data?.totals.completedPi ?? 0).toFixed(2), color: 'text-emerald-300' },
    { icon: Users, label: 'Unique donors', value: String(data?.totals.uniqueDonors ?? 0), color: 'text-yellow-300' },
  ];
  const completionRate = (data?.totals.intents ?? 0) > 0 ? ((data?.totals.completed ?? 0) / (data?.totals.intents ?? 1)) * 100 : 0;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">Pi mini-app payments</h2>
        <p className="text-xs text-zinc-500">Resumo agregado do fluxo demo de intents, approvals e completions.</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <card.icon className={`mb-2 h-4 w-4 ${card.color}`} />
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
            <p className="text-[11px] text-zinc-500">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Completion rate</span>
          <span>{completionRate.toFixed(1)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${Math.min(completionRate, 100)}%` }} />
        </div>
      </div>
    </div>
  );
}
