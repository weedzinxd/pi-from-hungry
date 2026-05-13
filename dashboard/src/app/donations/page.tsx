'use client';

import { Coins, HandHelping, HeartHandshake, Scale, Users, Wallet } from 'lucide-react';
import { PiPaymentsFeedPanel } from '@/components/pi-app/PiPaymentsFeedPanel';
import { PiPaymentsOverviewPanel } from '@/components/pi-app/PiPaymentsOverviewPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { InfoListPanel } from '@/components/public/InfoListPanel';
import { PageHero } from '@/components/public/PageHero';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useDonationsOverview } from '@/hooks/useDonationsOverview';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { formatInteger, formatNumber } from '@/lib/formatters';

export default function DonationsPage() {
  const { data: networkStatus } = useNetworkStatus();
  const { data } = useDonationsOverview();

  const cards = [
    { icon: Coins, label: 'PI necessário', value: formatNumber(data?.totals.totalPiNeeded ?? 0), color: 'text-yellow-400' },
    { icon: Wallet, label: 'PI distribuído', value: formatNumber(data?.totals.totalPiDistributed ?? 0), color: 'text-cyan-400' },
    { icon: HandHelping, label: 'Pessoas ajudadas', value: formatNumber(data?.totals.totalPeopleHelped ?? 0), color: 'text-emerald-400' },
    { icon: HeartHandshake, label: 'Proofs públicos', value: formatInteger(data?.totals.proofsCount ?? 0), color: 'text-red-400' },
    { icon: Wallet, label: 'Pi completado no mini-app', value: formatNumber(data?.totals.paymentCompletedPi ?? 0), color: 'text-emerald-300' },
    { icon: Users, label: 'Doadores únicos', value: formatInteger(data?.totals.paymentUniqueDonors ?? 0), color: 'text-cyan-300' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8">
          <PageHero
            eyebrow="Funding layer"
            title="Doações e impacto agregado"
            description="Painel público consolidado para apresentar necessidade financeira, distribuição simulada, camada de proofs e atividade do mini-app Pi em uma narrativa única e mais profissional."
            pills={
              <>
                <StatusPill label="donations" tone="success" />
                <StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'derived' ? 'success' : 'warning'} />
              </>
            }
            right={
              <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                <div className="mb-2 flex items-center gap-2 text-yellow-400">
                  <Scale className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em]">Reading mode</span>
                </div>
                <p className="max-w-xs text-sm leading-6 text-zinc-300">Use esta rota para discutir funding readiness, transparência e progressão do mini-app sem abrir muitos painéis de uma vez.</p>
              </div>
            }
          />
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Panel key={card.label} className="card-hover">
              <PanelBody className="p-5">
                <card.icon className={`mb-3 h-8 w-8 ${card.color}`} />
                <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-500">{card.label}</p>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <PiPaymentsOverviewPanel />
          <div className="grid gap-4 lg:grid-cols-2">
            <PiPaymentsFeedPanel />
            <InfoListPanel
              title="Leitura pública recomendada"
              subtitle="Como apresentar esta seção ao público"
              items={[
                'Use esta página para mostrar o potencial de coordenação financeira do projeto.',
                'Explique que os totais atuais são derivados da camada de dados da demo, das proofs registradas e do fluxo demo do mini-app Pi.',
                'Destaque que a missão é transparência e auditabilidade, não promessa de produção imediata.',
              ]}
              tone="cyan"
            />

            <Panel className="lg:col-span-2">
              <PanelHeader title="Próximo salto" subtitle="Para transformar esta área em operação real" />
              <PanelBody className="grid gap-3 md:grid-cols-3">
                {[
                  'Integrar eventos reais de doação e distribuição no contrato Soroban.',
                  'Persistir donors, memos, approvals, completions e provas em banco/indexador dedicado.',
                  'Exibir histórico temporal por hotspot e por ação auditável.',
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-300">• {item}</div>
                ))}
              </PanelBody>
            </Panel>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
