'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import type { PiUserImpactResponse } from '@/hooks/usePiUserImpact';
import type { PiPaymentIntent } from '@/hooks/usePiPaymentIntents';

export function PiRecommendedActionPanel({
  verified,
  latestIntent,
  impact,
}: {
  verified: boolean;
  latestIntent?: PiPaymentIntent;
  impact?: PiUserImpactResponse;
}) {
  let title = 'Connect your Pi account';
  let description = 'Valide a sessão para começar o fluxo do mini-app.';
  let href = '#session';

  if (verified) {
    title = 'Create your first donation intent';
    description = 'Escolha um hotspot crítico e registre a próxima ação demo.';
    href = '#donation-intent';
  }

  if (latestIntent?.status === 'pending_server_approval') {
    title = 'Approve the latest intent';
    description = 'Simule a resposta do backend para avançar o ciclo operacional.';
    href = '#server-actions';
  }

  if (latestIntent?.status === 'approved') {
    title = 'Complete the approved intent';
    description = 'Finalize o ciclo demo e gere impacto visível no passaporte.';
    href = '#server-actions';
  }

  if ((impact?.totals.completed ?? 0) >= 1) {
    title = 'Review your impact passport';
    description = 'Abra a área dedicada para explorar milestones, timeline e atividade recente.';
    href = '/pi-app/impact';
  }

  const isInternalPage = href.startsWith('/');

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(16,185,129,0.14),rgba(24,24,27,0.95))] p-4">
      <div className="mb-3 flex items-center gap-2 text-emerald-300">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-semibold">Next recommended action</span>
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-zinc-300">{description}</p>
      {isInternalPage ? (
        <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
          Open now <ArrowRight className="h-4 w-4" />
        </Link>
      ) : (
        <a href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
          Open now <ArrowRight className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
