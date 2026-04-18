'use client';

import { Activity, HandCoins, Utensils } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';
import type { NetworkStatus } from '@/types/domain';

export function AppHeader({ networkStatus }: { networkStatus?: NetworkStatus }) {
  const tone =
    networkStatus?.status === 'healthy'
      ? 'success'
      : networkStatus?.status === 'degraded'
        ? 'warning'
        : 'danger';

  return (
    <header className="border-b border-emerald-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-xl flex items-center justify-center shrink-0">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black flex items-center gap-2 flex-wrap">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  PI FROM HUNGRY
                </span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full border border-emerald-500/50 font-mono">
                  ENTERPRISE
                </span>
              </h1>
              <p className="text-xs text-zinc-500">Erradicando a fome com Blockchain + AI</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-xs font-medium">
              <Activity className="w-4 h-4 text-zinc-400" />
              <StatusPill label={networkStatus?.status ?? 'offline'} tone={tone} />
              <span className="text-zinc-400">ledger {networkStatus?.latestLedger ?? 0}</span>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm rounded-lg flex items-center gap-2">
              <HandCoins className="w-4 h-4" />DOAR PI
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
