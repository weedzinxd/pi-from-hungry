import Link from 'next/link';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="status" tone="success" />
            <StatusPill label="public ops" tone="neutral" />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Public operational status</h1>
          <p className="mt-4 text-zinc-400">
            Snapshot executivo da demo pública, útil para compartilhar rapidamente a situação da rede, deployment e fontes de dados.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="Uso recomendado" subtitle="Como usar esta página em uma apresentação" />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>• Abra esta rota no início para situar a audiência tecnicamente.</li>
                <li>• Mostre rede, contrato, hotspots e proofs em uma única visão rápida.</li>
                <li>• Use como transição para dashboard, proofs e transparency.</li>
              </ul>
              <Link href="/methodology" className="mt-4 inline-block text-sm text-emerald-400 hover:text-emerald-300">
                Ver metodologia do pipeline →
              </Link>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Objetivo" subtitle="Visibilidade operacional pública" />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>• reduzir ambiguidade sobre o estágio da demo</li>
                <li>• reforçar a narrativa de transparência</li>
                <li>• facilitar validação rápida em deploy público</li>
              </ul>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
