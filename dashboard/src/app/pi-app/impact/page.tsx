import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, Award } from 'lucide-react';
import { PiImpactWorkspace } from '@/components/pi-app/PiImpactWorkspace';
import { PageHero } from '@/components/public/PageHero';

export const metadata: Metadata = {
  title: 'Pi From Hungry • Impact Passport',
  description: 'Área dedicada ao impacto do pioneiro no mini-app Pi From Hungry.',
};

export default function PiAppImpactPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
      <Link href="/pi-app" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Pi app
      </Link>

      <div className="mb-8">
        <PageHero
          eyebrow="Pioneer profile"
          title="Impact passport"
          description="Área dedicada para evolução do perfil do pioneiro com badges, timeline pessoal, histórico, milestones e próximas ações dentro do ecossistema Pi."
          right={
            <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-yellow-400">
                <Award className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Impact view</span>
              </div>
              <p className="max-w-xs text-sm leading-6 text-zinc-300">Use esta área para mostrar progresso pessoal, milestones e histórico do mini-app em uma visão mais rica.</p>
            </div>
          }
        />
      </div>

      <Suspense fallback={<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">Carregando impacto...</div>}>
        <PiImpactWorkspace />
      </Suspense>

      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/95 p-5 text-sm leading-7 text-zinc-300">
        <p>• Próxima evolução: sincronizar esta área com auth oficial, pagamentos reais, provas por usuário e callbacks oficiais do ecossistema Pi.</p>
      </div>
    </main>
  );
}
