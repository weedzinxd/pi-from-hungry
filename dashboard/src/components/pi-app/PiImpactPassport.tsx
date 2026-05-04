'use client';

import { Award, CheckCircle2, Wallet } from 'lucide-react';
import type { PiUserImpactResponse } from '@/hooks/usePiUserImpact';

export function PiImpactPassport({ impact }: { impact?: PiUserImpactResponse }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Impact passport</h2>
          <p className="text-xs text-zinc-500">Resumo pessoal para App Studio e Pi Browser.</p>
        </div>
        <Award className="h-4 w-4 text-yellow-400" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="text-zinc-500">Badges</p>
          <p className="mt-1 text-xl font-bold text-white">{impact?.badges.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="text-zinc-500">Total Pi</p>
          <p className="mt-1 text-xl font-bold text-white">{impact?.totals.totalPi?.toFixed(2) ?? '0.00'}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
          <p className="text-zinc-500">Completed</p>
          <p className="mt-1 text-xl font-bold text-white">{impact?.totals.completed ?? 0}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(impact?.badges ?? []).map((badge) => (
          <span key={badge} className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-3 w-3" /> {badge}
          </span>
        ))}
        {!impact?.badges.length ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1 text-xs text-zinc-500">
            <Wallet className="h-3 w-3" /> Ainda sem badges
          </span>
        ) : null}
      </div>
    </div>
  );
}
