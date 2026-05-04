import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PiImpactWorkspace } from '@/components/pi-app/PiImpactWorkspace';

export const metadata: Metadata = {
  title: 'Pi From Hungry • Impact Passport',
  description: 'Área dedicada ao impacto do pioneiro no mini-app Pi From Hungry.',
};

export default function PiAppImpactPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-black px-4 py-8 text-white">
      <Link href="/pi-app" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Voltar ao Pi app
      </Link>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">Pi mini-app</p>
        <h1 className="mt-2 text-3xl font-black">Impact passport</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Área dedicada para futura expansão do perfil do pioneiro com badges, histórico e milestones dentro do ecossistema Pi.
        </p>
      </div>
      <Suspense fallback={<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">Carregando impacto...</div>}>
        <PiImpactWorkspace />
      </Suspense>
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-300">
        <p>• Próxima evolução: sincronizar esta área com auth oficial, pagamentos reais e provas por usuário.</p>
      </div>
    </main>
  );
}
