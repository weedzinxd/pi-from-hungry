'use client';

import { Database, FileCheck2, Radar, ShieldCheck } from 'lucide-react';
import { usePublicStatus } from '@/hooks/usePublicStatus';

export function PublicStatusStrip() {
  const { data } = usePublicStatus();

  const items = [
    {
      icon: Radar,
      label: 'Rede',
      value: `${data?.network.status ?? 'offline'} • ledger ${data?.network.latestLedger ?? 0}`,
    },
    {
      icon: ShieldCheck,
      label: 'Contrato',
      value: data?.deployment.source ?? 'unconfigured',
    },
    {
      icon: Database,
      label: 'Hotspots',
      value: `${data?.data.hotspotsSource ?? 'demo'} • ${data?.data.hotspotsCount ?? 0}`,
    },
    {
      icon: FileCheck2,
      label: 'Proofs',
      value: String(data?.data.proofsCount ?? 0),
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-2xl border border-zinc-800/90 bg-zinc-950/90 p-4 shadow-[0_10px_30px_-20px_rgba(16,185,129,0.16)]">
          <div className="mb-2 flex items-center gap-2 text-zinc-300">
            <item.icon className="h-4 w-4 text-emerald-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</span>
          </div>
          <p className="text-sm font-semibold leading-6 text-white">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
