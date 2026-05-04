'use client';

import { Coins, HandHelping, HeartHandshake, Scale, Users, Wallet } from 'lucide-react';
import { PiPaymentsFeedPanel } from '@/components/pi-app/PiPaymentsFeedPanel';
import { PiPaymentsOverviewPanel } from '@/components/pi-app/PiPaymentsOverviewPanel';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useDonationsOverview } from '@/hooks/useDonationsOverview';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { formatNumber } from '@/lib/formatters';

export default function DonationsPage() {
  const { data: networkStatus } = useNetworkStatus();
  const { data } = useDonationsOverview();

  const cards = [
    { icon: Coins, label: 'PI necessário', value: formatNumber(data?.totals.totalPiNeeded ?? 0), color: 'text-yellow-400' },
    { icon: Wallet, label: 'PI distribuído', value: formatNumber(data?.totals.totalPiDistributed ?? 0), color: 'text-cyan-400' },
    { icon: HandHelping, label: 'Pessoas ajudadas', value: formatNumber(data?.totals.totalPeopleHelped ?? 0), color: 'text-emerald-400' },
    { icon: HeartHandshake, label: 'Proofs públicos', value: String(data?.totals.proofsCount ?? 0), color: 'text-red-400' },
    { icon: Wallet, label: 'Pi completado no mini-app', value: formatNumber(data?.totals.paymentCompletedPi ?? 0), color: 'text-emerald-300' },
    { icon: Users, label: 'Doadores únicos', value: String(data?.totals.paymentUniqueDonors ?? 0), color: 'text-cyan-300' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="donations" tone="success" />
            <StatusPill label={data?.source ?? 'loading'} tone={data?.source === 'derived' ? 'success' : 'warning'} />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Doações e impacto agregado</h1>
          <p className="mt-4 text-zinc-400">
            Painel público consolidado para apresentar necessidade financeira, distribuição simulada e trilha social da demo.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => (
            <Panel key={card.label}>
              <PanelBody className="p-5">
                <card.icon className={`mb-3 h-8 w-8 ${card.color}`} />
                <p className={`text-3xl font-black ${card.color}`}>{card.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{card.label}</p>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <PiPaymentsOverviewPanel />
          <div className="grid gap-4 lg:grid-cols-2">
            <PiPaymentsFeedPanel />
          <Panel>
            <PanelHeader title="Leitura pública recomendada" subtitle="Como apresentar esta seção ao público" right={<Scale className="h-4 w-4 text-emerald-400" />} />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>• Use esta página para mostrar o potencial de coordenação financeira do projeto.</li>
                <li>• Explique que os totais atuais são derivados da camada de dados da demo, das proofs registradas e do fluxo demo do mini-app Pi.</li>
                <li>• Destaque que a missão é transparência e auditabilidade, não promessa de produção imediata.</li>
              </ul>
            </PanelBody>
          </Panel>

            <Panel>
              <PanelHeader title="Próximo salto" subtitle="Para transformar esta área em operação real" />
              <PanelBody>
                <ul className="space-y-3 text-sm text-zinc-300">
                  <li>• Integrar eventos reais de doação e distribuição no contrato Soroban.</li>
                  <li>• Persistir donors, memos, approvals, completions e provas em banco/indexador dedicado.</li>
                  <li>• Exibir histórico temporal por hotspot e por ação auditável.</li>
                </ul>
              </PanelBody>
            </Panel>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
