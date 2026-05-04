'use client';

import { Trophy } from 'lucide-react';
import type { PiUserImpactResponse } from '@/hooks/usePiUserImpact';

export function PiMilestonesPanel({ impact }: { impact?: PiUserImpactResponse }) {
  const completed = impact?.totals.completed ?? 0;
  const completedPi = impact?.totals.completedPi ?? 0;

  const milestones = [
    {
      label: 'Primeira intent criada',
      done: (impact?.totals.intents ?? 0) >= 1,
    },
    {
      label: 'Primeira conclusão',
      done: completed >= 1,
    },
    {
      label: '5 Pi concluídos',
      done: completedPi >= 5,
    },
    {
      label: '3 ações completadas',
      done: completed >= 3,
    },
  ];

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Milestones</h2>
          <p className="text-xs text-zinc-500">Metas rápidas para explicar evolução do impacto pessoal.</p>
        </div>
        <Trophy className="h-4 w-4 text-yellow-400" />
      </div>
      <div className="space-y-2">
        {milestones.map((milestone) => (
          <div key={milestone.label} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2">
            <span className="text-sm text-white">{milestone.label}</span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${milestone.done ? 'bg-emerald-500/15 text-emerald-300' : 'bg-zinc-800 text-zinc-400'}`}>
              {milestone.done ? 'done' : 'pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
