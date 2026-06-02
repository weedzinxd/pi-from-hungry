'use client';

import { CheckCircle2, FileBadge2, Globe2, Link2 } from 'lucide-react';
import { useProofs } from '@/hooks/useProofs';
import { formatDateTime } from '@/lib/formatters';

export function ProofsSummaryStrip() {
  const { data } = useProofs();
  const latest = data?.proofs?.[0];
  const registered = data?.proofs?.filter((item) => item.status === 'registered').length ?? 0;

  const items = [
    { icon: CheckCircle2, label: 'Registrados', value: String(registered), color: 'text-emerald-400' },
    { icon: Globe2, label: 'Rede', value: latest?.network ?? 'Pi Testnet', color: 'text-cyan-400' },
    { icon: Link2, label: 'Último registro', value: formatDateTime(latest?.recordedAt), color: 'text-yellow-400' },
    { icon: FileBadge2, label: 'Fonte', value: data?.source ?? 'loading', color: 'text-white' },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-4 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.16)]">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
          </div>
          <p className="text-sm font-semibold leading-6 text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
