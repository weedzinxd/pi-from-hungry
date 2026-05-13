import { Rocket, ShieldCheck } from 'lucide-react';
import { PiPaymentsOverviewPanel } from '@/components/pi-app/PiPaymentsOverviewPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { InfoListPanel } from '@/components/public/InfoListPanel';
import { PageHero } from '@/components/public/PageHero';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

const checks = [
  'Deploy da API configurado ou fallback standalone já preparado para a demo.',
  'Deploy do dashboard configurado.',
  'CI com build e typecheck.',
  'Página pública de proofs e transparência.',
  'Detector/pipeline integrado como fonte de hotspots.',
  'Mini-app Pi App Studio com auth demo, intents, approve/complete, impact passport, milestones, próximas ações, timeline pessoal e feed agregado.',
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <PageHero
            eyebrow="Go live"
            title="Launch readiness"
            description="Página executiva para revisar rapidamente se a demo já está pronta para ser apresentada ao público, parceiros e comunidade com narrativa clara e credibilidade técnica."
            pills={
              <>
                <StatusPill label="launch readiness" tone="success" />
                <StatusPill label="public demo" tone="neutral" />
              </>
            }
            right={
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-emerald-400">
                  <Rocket className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Release state</span>
                </div>
                <p className="max-w-xs text-sm leading-6 text-zinc-300">Use esta página como checklist final antes de demo pública, showcase ou submissão ao ecossistema Pi.</p>
              </div>
            }
          />
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="mb-8">
          <PiPaymentsOverviewPanel />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InfoListPanel title="Itens concluídos" subtitle="Base pronta para demo pública" items={checks} />

          <Panel>
            <PanelHeader title="Antes de publicar amplamente" subtitle="Últimas validações recomendadas" right={<ShieldCheck className="h-4 w-4 text-cyan-400" />} />
            <PanelBody className="space-y-3">
              {[
                'Configurar CONTRACT_ID real de testnet.',
                'Atualizar snapshot de eventos indexados.',
                'Validar /proofs, /methodology e /transparency em produção.',
                'Revisar mensagem pública de demo/testnet na home.',
                'Validar /pi-app e /pi-app/impact em mobile antes de cadastrar no App Studio.',
                'Revisar journey status, completion rate, milestones e impact feed com dados consistentes.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-4 text-sm leading-6 text-zinc-300">
                  • {item}
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
