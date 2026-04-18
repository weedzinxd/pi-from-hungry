import { HandCoins, MapPin } from 'lucide-react';
import { GVC_VALUE, PI_PRICE } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';
import type { CrisisEvent } from '@/types/domain';

export function DetailsPanel({ event }: { event: CrisisEvent | null }) {
  if (!event) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
        <MapPin className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
        <p className="text-zinc-500">Selecione um foco</p>
      </div>
    );
  }

  const piGvc = Math.ceil(event.piNeeded / GVC_VALUE);
  const usdValue = event.piNeeded * PI_PRICE;

  return (
    <div className="bg-zinc-900 rounded-xl border border-emerald-500/30 overflow-hidden">
      <div className={`p-3 border-b border-zinc-800 ${event.severity === 'CRITICAL' ? 'bg-red-500/10' : 'bg-orange-500/10'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold">{event.location}</h3>
            <p className="text-zinc-400 text-xs">{event.country}</p>
          </div>
          <span className={`px-2 py-0.5 text-xs font-bold rounded ${event.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
            {event.severity}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3">
        <div className="bg-gradient-to-r from-yellow-500/10 to-blue-500/10 rounded-lg p-3 border border-yellow-500/30">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-500/10 rounded p-2 text-center">
              <p className="text-yellow-400 text-[10px]">Unidades internas</p>
              <p className="text-lg font-bold text-yellow-400">{formatNumber(piGvc)}</p>
            </div>
            <div className="bg-blue-500/10 rounded p-2 text-center">
              <p className="text-blue-400 text-[10px]">Referência USD</p>
              <p className="text-lg font-bold text-blue-400">${formatNumber(usdValue)}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-zinc-800/50 rounded p-2"><p className="text-[10px] text-zinc-500">Afetados</p><p className="text-sm font-bold text-red-400">{formatNumber(event.affected)}</p></div>
          <div className="bg-zinc-800/50 rounded p-2"><p className="text-[10px] text-zinc-500">Já Ajudados</p><p className="text-sm font-bold text-emerald-400">{formatNumber(event.peopleHelped)}</p></div>
        </div>
        <p className="text-xs text-zinc-300">{event.description}</p>
        <button className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2">
          <HandCoins className="w-4 h-4" />DOAR PI
        </button>
      </div>
    </div>
  );
}
