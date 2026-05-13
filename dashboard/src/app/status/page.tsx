import Link from 'next/link';
import { ArrowRight, Gauge, Workflow } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { InfoListPanel } from '@/components/public/InfoListPanel';
import { PageHero } from '@/components/public/PageHero';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <PageHero
            eyebrow="Ops snapshot"
            title="Public operational status"
            description="Snapshot executivo da demo pública para compartilhar rapidamente rede, deployment, ingestão e sinais de prontidão com parceiros e comunidade."
            pills={
              <>
                <StatusPill label="status" tone="success" />
                <StatusPill label="public ops" tone="neutral" />
              </>
            }
            right={
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-cyan-400">
                  <Gauge className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Usage</span>
                </div>
                <p className="max-w-xs text-sm leading-6 text-zinc-300">Use esta rota no início da apresentação para estabelecer credibilidade técnica em segundos.</p>
              </div>
            }
          />
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoListPanel
            title="Uso recomendado"
            subtitle="Como usar esta página em uma apresentação"
            items={[
              'Abra esta rota no início para situar a audiência tecnicamente.',
              'Mostre rede, contrato, hotspots e proofs em uma única visão rápida.',
              'Use como transição para dashboard, proofs e transparency.',
            ]}
          />

          <Panel>
            <PanelHeader title="Objetivo" subtitle="Visibilidade operacional pública" right={<Workflow className="h-4 w-4 text-emerald-400" />} />
            <PanelBody className="grid gap-3">
              {[
                'reduzir ambiguidade sobre o estágio da demo',
                'reforçar a narrativa de transparência',
                'facilitar validação rápida em deploy público',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">
                  • {item}
                </div>
              ))}
              <Link href="/methodology" className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                Ver metodologia do pipeline <ArrowRight className="h-4 w-4" />
              </Link>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
