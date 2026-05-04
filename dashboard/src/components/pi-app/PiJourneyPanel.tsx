'use client';

import { CheckCircle2, Circle, CircleDashed, LockKeyhole, Wallet } from 'lucide-react';
import type { PiUserImpactResponse } from '@/hooks/usePiUserImpact';
import type { PiPaymentIntent } from '@/hooks/usePiPaymentIntents';

function stepIcon(state: 'done' | 'active' | 'idle') {
  if (state === 'done') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
  if (state === 'active') return <CircleDashed className="h-4 w-4 text-yellow-400" />;
  return <Circle className="h-4 w-4 text-zinc-600" />;
}

export function PiJourneyPanel({
  verified,
  latestIntent,
  impact,
}: {
  verified: boolean;
  latestIntent?: PiPaymentIntent;
  impact?: PiUserImpactResponse;
}) {
  const hasIntent = Boolean(latestIntent);
  const approved = latestIntent?.status === 'approved' || latestIntent?.status === 'completed';
  const completed = latestIntent?.status === 'completed';

  const steps = [
    {
      title: 'Auth',
      subtitle: verified ? 'Sessão validada no backend demo' : 'Conecte o SDK Pi primeiro',
      state: verified ? 'done' : 'active',
    },
    {
      title: 'Intent',
      subtitle: hasIntent ? latestIntent?.hotspotLabel ?? 'Intent criada' : 'Crie uma intent de doação',
      state: hasIntent ? 'done' : verified ? 'active' : 'idle',
    },
    {
      title: 'Approval',
      subtitle: approved ? 'Aprovação simulada concluída' : 'Aguardando ação do servidor',
      state: approved ? 'done' : hasIntent ? 'active' : 'idle',
    },
    {
      title: 'Impact',
      subtitle: completed ? `${impact?.totals.completedPi?.toFixed(2) ?? '0.00'} Pi completado` : 'Conclua para gerar impacto',
      state: completed ? 'done' : approved ? 'active' : 'idle',
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">Journey status</h2>
          <p className="text-xs text-zinc-500">Leitura rápida do fluxo dentro do mini-app.</p>
        </div>
        <LockKeyhole className="h-4 w-4 text-cyan-400" />
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.title} className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="mt-0.5">{stepIcon(step.state)}</div>
            <div>
              <p className="text-sm font-semibold text-white">{step.title}</p>
              <p className="text-xs text-zinc-500">{step.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-zinc-300">
        <div className="mb-1 flex items-center gap-2 text-emerald-300">
          <Wallet className="h-3.5 w-3.5" /> Demo-safe workflow
        </div>
        <p>Este journey demonstra o fluxo final esperado no App Studio, mas ainda precisa dos callbacks oficiais do Pi para produção.</p>
      </div>
    </div>
  );
}
