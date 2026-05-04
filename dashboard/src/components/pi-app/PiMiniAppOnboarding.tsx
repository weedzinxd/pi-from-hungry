'use client';

import { Compass, ShieldCheck, Wallet } from 'lucide-react';

const steps = [
  {
    icon: Wallet,
    title: '1. Conecte sua conta Pi',
    description: 'Abra o mini-app no Pi Browser/App Studio e valide a sessão para habilitar o fluxo de impacto.',
  },
  {
    icon: Compass,
    title: '2. Escolha um hotspot',
    description: 'Selecione uma região crítica, defina o valor em Pi e crie sua intent de doação demo.',
  },
  {
    icon: ShieldCheck,
    title: '3. Acompanhe aprovação e impacto',
    description: 'Use os painéis de journey, impact passport e feed para demonstrar transparência operacional.',
  },
];

export function PiMiniAppOnboarding() {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-[linear-gradient(180deg,rgba(8,145,178,0.10),rgba(24,24,27,0.95))] p-4">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-white">How to demo this mini-app</h2>
        <p className="text-xs text-zinc-400">Guia rápido para apresentações em mobile, App Studio ou Pi Browser.</p>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-xl border border-zinc-800 bg-black/40 p-3">
            <div className="mb-2 flex items-center gap-2 text-cyan-300">
              <step.icon className="h-4 w-4" />
              <span className="text-sm font-semibold">{step.title}</span>
            </div>
            <p className="text-xs text-zinc-400">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
