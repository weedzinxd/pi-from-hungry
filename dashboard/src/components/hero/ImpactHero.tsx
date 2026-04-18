'use client';

import { AlertTriangle, Calculator, DollarSign, Globe, HeartPulse, Users } from 'lucide-react';
import { COST_PER_PERSON_YEAR, GVC_VALUE, PI_PRICE } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';
import type { CrisisEvent } from '@/types/domain';

export function ImpactHero({ events }: { events: CrisisEvent[] }) {
  const totalAffected = events.reduce((acc, e) => acc + e.affected, 0);
  const totalHelped = events.reduce((acc, e) => acc + e.peopleHelped, 0);
  const totalPiDistributed = events.reduce((acc, e) => acc + e.piDistributed, 0);
  const totalPiNeeded = events.reduce((acc, e) => acc + e.piNeeded, 0);
  const gvcUnitsNeeded = Math.ceil(totalPiNeeded / GVC_VALUE);
  const progressPercent = totalPiNeeded > 0 ? (totalPiDistributed / totalPiNeeded) * 100 : 0;
  const peoplePerGvc = Math.floor((GVC_VALUE * PI_PRICE) / COST_PER_PERSON_YEAR);

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 border-2 border-emerald-500/50">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative px-6 py-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/20 rounded-full border border-red-500/50 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-red-400 font-bold text-sm">CRISIS ACTIVE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-2">
            PLATAFORMA DE COMBATE À <span className="text-red-400">FOME</span>
          </h2>
          <p className="text-zinc-400 max-w-3xl mx-auto">
            IA para priorização, blockchain para transparência e operação preparada para escala.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: 'Pessoas Afetadas', value: formatNumber(totalAffected), color: 'text-red-400' },
            { icon: HeartPulse, label: 'Já Ajudadas', value: formatNumber(totalHelped), color: 'text-emerald-400' },
            { icon: DollarSign, label: 'PI Necessário', value: formatNumber(totalPiNeeded), color: 'text-yellow-400' },
            { icon: Globe, label: 'Regiões', value: events.length.toString(), color: 'text-cyan-400' },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-950/70 rounded-xl p-4 text-center border border-zinc-800">
              <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
              <p className={`text-3xl md:text-4xl font-black ${item.color}`}>{item.value}</p>
              <p className="text-sm text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-black/60 rounded-xl p-6 border border-yellow-500/30">
          <h3 className="text-center text-white font-bold text-lg mb-4 flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5 text-yellow-400" />
            MÉTRICA INTERNA DE IMPACTO
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-yellow-500/10 rounded-lg p-4 text-center border border-yellow-500/30">
              <p className="text-yellow-400 text-sm mb-1">1 unidade de referência</p>
              <p className="text-2xl font-bold text-yellow-400">314,159 PI</p>
              <p className="text-xs text-zinc-400">métrica interna do projeto</p>
            </div>
            <div className="bg-emerald-500/10 rounded-lg p-4 text-center border border-emerald-500/30">
              <p className="text-emerald-400 text-sm mb-1">1 unidade ≈ {peoplePerGvc} pessoas</p>
              <p className="text-2xl font-bold text-emerald-400">/ ano</p>
              <p className="text-xs text-zinc-400">estimativa social</p>
            </div>
            <div className="bg-blue-500/10 rounded-lg p-4 text-center border border-blue-500/30">
              <p className="text-blue-400 text-sm mb-1">Unidades necessárias</p>
              <p className="text-2xl font-bold text-blue-400">{formatNumber(gvcUnitsNeeded)}</p>
              <p className="text-xs text-zinc-400">para os hotspots carregados</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Progresso atual</span>
              <span className="text-emerald-400">{progressPercent.toFixed(2)}%</span>
            </div>
            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
