import { Droplets, ExternalLink, Satellite, Thermometer, TreePine, Waves, Wind } from 'lucide-react';
import { formatPercent } from '@/lib/formatters';
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

  const primarySatelliteUrl = event.noaaSatelliteUrl || event.satelliteUrl;
  const primarySatelliteLabel = event.noaaSatelliteUrl ? 'SATELLITE LIVE - NOAA STAR' : 'SATELLITE LIVE - NASA FIRMS';
  const primarySatelliteTitle = event.noaaSatelliteUrl ? 'NOAA Vegetation View' : 'NASA Fire Map';

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 rounded-xl border border-cyan-500/30 overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-bold text-sm">{primarySatelliteLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            {event.noaaSatelliteUrl ? (
              <a href={event.satelliteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> NASA ref
              </a>
            ) : null}
            <a href={primarySatelliteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-white flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Full Screen
            </a>
          </div>
        </div>
        <div className="relative bg-zinc-950 p-5">
          {event.noaaSatelliteUrl ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-zinc-300">
                <p className="font-semibold text-white">Camada NOAA ativa</p>
                <p className="mt-2 leading-6 text-zinc-400">
                  Este hotspot agora usa NOAA STAR Vegetation Health Products como camada satelital principal.
                  A visualização NOAA abre em nova aba e os índices live já estão incorporados ao score abaixo.
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center">
                  <Satellite className="mx-auto mb-2 h-5 w-5 text-cyan-400" />
                  <p className="text-xs text-zinc-500">NOAA VHI</p>
                  <p className="mt-1 text-xl font-bold text-white">{Number(event.analytics?.noaaVhi ?? 0).toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center">
                  <TreePine className="mx-auto mb-2 h-5 w-5 text-emerald-400" />
                  <p className="text-xs text-zinc-500">NOAA VCI</p>
                  <p className="mt-1 text-xl font-bold text-white">{Number(event.analytics?.noaaVci ?? 0).toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center">
                  <Thermometer className="mx-auto mb-2 h-5 w-5 text-orange-400" />
                  <p className="text-xs text-zinc-500">NOAA TCI</p>
                  <p className="mt-1 text-xl font-bold text-white">{Number(event.analytics?.noaaTci ?? 0).toFixed(2)}</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-center">
                  <Waves className="mx-auto mb-2 h-5 w-5 text-sky-400" />
                  <p className="text-xs text-zinc-500">Stress NOAA</p>
                  <p className="mt-1 text-xl font-bold text-white">{formatPercent(event.analytics?.noaaVegetationStressScore ?? 0)}</p>
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-black/30 p-4 text-xs text-zinc-400">
                Semana NOAA: <span className="font-semibold text-white">{event.analytics?.noaaReferenceWeek ?? 'n/a'}/{event.analytics?.noaaReferenceYear ?? 'n/a'}</span>
              </div>
            </div>
          ) : (
            <iframe src={primarySatelliteUrl} className="h-[320px] w-full border-0" title={primarySatelliteTitle} sandbox="allow-scripts allow-same-origin" />
          )}
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
