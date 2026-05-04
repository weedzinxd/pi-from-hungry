import Link from 'next/link';
import { Heart } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="border-t border-zinc-800 mt-8 py-6 text-center">
      <p className="text-zinc-500 text-sm">2026 Pi From Hungry • MIT License</p>
      <p className="text-zinc-600 text-xs mt-1 flex items-center justify-center gap-2">
        <Heart className="w-3 h-3 text-red-400" />
        Missão: Erradicar a fome usando transparência, IA e blockchain
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
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
      <div className="flex items-center justify-center gap-4 mt-3">
        <a href="https://github.com/weedzinxd" className="text-zinc-400 hover:text-white text-xs">
          @weedzinxd
        </a>
        <a href="https://x.com/WeedzinxD" className="text-zinc-400 hover:text-white text-xs">
          @WeedzinxD
        </a>
      </div>
    </footer>
  );
}
