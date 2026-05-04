'use client';

import { useSearchParams } from 'next/navigation';
import { PiImpactPassport } from '@/components/pi-app/PiImpactPassport';
import { PiPaymentsFeedPanel } from '@/components/pi-app/PiPaymentsFeedPanel';
import { PiPaymentsOverviewPanel } from '@/components/pi-app/PiPaymentsOverviewPanel';
import { PiPersonalTimeline } from '@/components/pi-app/PiPersonalTimeline';
import { usePiUserImpact } from '@/hooks/usePiUserImpact';

export function PiImpactWorkspace() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username') ?? 'preview-user';
  const impact = usePiUserImpact(username);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
        <p>
          Perfil ativo: <span className="font-semibold text-white">@{username}</span>
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          Esta área usa o endpoint de impacto do mini-app para montar uma visão por pioneiro/doador.
        </p>
      </div>
      <PiPaymentsOverviewPanel />
      <PiImpactPassport impact={impact.data} />
      <PiPersonalTimeline impact={impact.data} />
      <PiPaymentsFeedPanel />
    </div>
  );
}
