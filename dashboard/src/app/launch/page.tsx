import { PiPaymentsOverviewPanel } from '@/components/pi-app/PiPaymentsOverviewPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

const checks = [
  'Deploy da API configurado',
  'Deploy do dashboard configurado',
  'CI com build e typecheck',
  'Página pública de proofs',
  'Página pública de transparência',
  'Detector integrado como fonte de hotspots',
  'Mini-app Pi App Studio com auth demo, intents, approve/complete, impact passport, milestones, próximas ações, timeline pessoal e feed agregado',
];

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="launch readiness" tone="success" />
            <StatusPill label="public demo" tone="neutral" />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Launch readiness</h1>
          <p className="mt-4 text-zinc-400">
            Página executiva para revisar rapidamente se a demo já está pronta para ser apresentada ao público, parceiros e comunidade.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="mb-8">
          <PiPaymentsOverviewPanel />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="Itens concluídos" subtitle="Base pronta para demo pública" />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                {checks.map((check) => (
                  <li key={check}>• {check}</li>
                ))}
              </ul>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Antes de publicar amplamente" subtitle="Últimas validações recomendadas" />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>• Configurar CONTRACT_ID real de testnet.</li>
                <li>• Atualizar snapshot de eventos indexados.</li>
                <li>• Validar /proofs, /methodology e /transparency em produção.</li>
                <li>• Revisar mensagem pública de demo/testnet na home.</li>
                <li>• Validar /pi-app e /pi-app/impact em mobile antes de cadastrar no App Studio.</li>
                <li>• Revisar journey status, completion rate, milestones e impact feed com dados consistentes.</li>
              </ul>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
