'use client';

import Link from 'next/link';
import { Activity, HandCoins, Utensils } from 'lucide-react';
import { StatusPill } from '@/components/ui/StatusPill';
import type { NetworkStatus } from '@/types/domain';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/hotspots', label: 'Hotspots' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/comparison', label: 'Comparison' },
  { href: '/pi-app', label: 'Pi App' },
  { href: '/donations', label: 'Donations' },
  { href: '/proofs', label: 'Proofs' },
  { href: '/status', label: 'Status' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/launch', label: 'Launch' },
  { href: '/transparency', label: 'Transparência' },
];

export function AppHeader({ networkStatus }: { networkStatus?: NetworkStatus }) {
  const tone =
    networkStatus?.status === 'healthy'
      ? 'success'
      : networkStatus?.status === 'degraded'
        ? 'warning'
        : 'danger';

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-500/30 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-600 shadow-lg shadow-emerald-500/10">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-lg font-black tracking-tight text-transparent sm:text-xl">
                  PI FROM HUNGRY
                </span>
                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-300">
                  PUBLIC DEMO
                </span>
              </div>
              <p className="mt-1 max-w-md text-xs leading-5 text-zinc-500">
                Transparência, analytics e mini-app Pi em modo demo/testnet.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <nav className="hidden max-w-full flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 text-xs font-medium lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-md px-3 py-2 text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
              <div className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium md:flex">
                <Activity className="h-4 w-4 text-zinc-400" />
                <StatusPill label={networkStatus?.status ?? 'offline'} tone={tone} />
                <span className="text-zinc-400">ledger {networkStatus?.latestLedger ?? 0}</span>
              </div>
              <Link
                href="/transparency"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-bold text-black"
              >
                <HandCoins className="h-4 w-4" /> APOIAR DEMO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
