import { Droplets, ExternalLink, Satellite, Thermometer, TreePine, Wind } from 'lucide-react';
import type { CrisisEvent } from '@/types/domain';

export function SatelliteSection({ event }: { event: CrisisEvent | null }) {
  if (!event) {
    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 text-center">
        <Satellite className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-500">Selecione um foco no mapa</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 rounded-xl border border-cyan-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold text-sm">SATELLITE LIVE - NASA FIRMS</span>
          </div>
          <a href={event.satelliteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Full Screen
          </a>
        </div>
        <div className="relative h-[250px] bg-zinc-950">
          <iframe src={event.satelliteUrl} className="w-full h-full border-0" title="NASA Fire Map" sandbox="allow-scripts allow-same-origin" />
        </div>
      </div>

      <div className="bg-zinc-900 rounded-xl border border-orange-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-bold text-sm">DADOS CLIMÁTICOS AO VIVO</span>
        </div>
        <div className="p-4 grid grid-cols-4 gap-3 text-center">
          <div>
            <Thermometer className="w-6 h-6 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-400">{event.liveData.temperature}°C</p>
          </div>
          <div>
            <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-blue-400">{event.liveData.humidity}%</p>
          </div>
          <div>
            <Wind className="w-6 h-6 text-zinc-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-zinc-300">{event.liveData.windSpeed} km/h</p>
          </div>
          <div>
            <TreePine className="w-6 h-6 text-amber-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-amber-400">{event.liveData.drought}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
