import Link from 'next/link';
import { Heart } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="mt-10 border-t border-zinc-800/80 bg-zinc-950/70">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-200">2026 Pi From Hungry • MIT License</p>
            <p className="mt-2 flex items-center gap-2 text-xs leading-6 text-zinc-500">
              <Heart className="h-3.5 w-3.5 text-red-400" />
              Missão: erradicar a fome usando transparência, IA e blockchain.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
            <Link href="/" className="text-zinc-400 hover:text-white">Home</Link>
            <Link href="/dashboard" className="text-zinc-400 hover:text-white">Dashboard</Link>
            <Link href="/hotspots" className="text-zinc-400 hover:text-white">Hotspots</Link>
            <Link href="/analytics" className="text-zinc-400 hover:text-white">Analytics</Link>
            <Link href="/comparison" className="text-zinc-400 hover:text-white">Comparison</Link>
            <Link href="/pi-app" className="text-zinc-400 hover:text-white">Pi App</Link>
            <Link href="/donations" className="text-zinc-400 hover:text-white">Donations</Link>
            <Link href="/proofs" className="text-zinc-400 hover:text-white">Proofs</Link>
            <Link href="/status" className="text-zinc-400 hover:text-white">Status</Link>
            <Link href="/methodology" className="text-zinc-400 hover:text-white">Methodology</Link>
            <Link href="/launch" className="text-zinc-400 hover:text-white">Launch</Link>
            <Link href="/transparency" className="text-zinc-400 hover:text-white">Transparência</Link>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          <a href="https://github.com/weedzinxd" className="hover:text-white">
            @weedzinxd
          </a>
          <a href="https://x.com/WeedzinxD" className="hover:text-white">
            @WeedzinxD
          </a>
        </div>
      </div>
    </footer>
  );
}
