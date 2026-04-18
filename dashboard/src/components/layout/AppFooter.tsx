import { Heart } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="border-t border-zinc-800 mt-8 py-6 text-center">
      <p className="text-zinc-500 text-sm">2026 Pi From Hungry • MIT License</p>
      <p className="text-zinc-600 text-xs mt-1 flex items-center justify-center gap-2">
        <Heart className="w-3 h-3 text-red-400" />
        Missão: Erradicar a fome usando transparência, IA e blockchain
      </p>
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
