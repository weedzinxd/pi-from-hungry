'use client';

import Link from 'next/link';
import { ArrowRight, Database, ShieldCheck, Signal, Wallet } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { useDataSources } from '@/hooks/useDataSources';
import { useDeploymentStatus } from '@/hooks/useDeploymentStatus';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const transparencyItems = [
  {
    icon: Signal,
    title: 'Status da rede',
    description: 'A demo consulta a Pi Testnet RPC para exibir saúde do nó e progresso de ledgers.',
    status: 'live rpc',
    tone: 'success' as const,
  },
  {
    icon: Wallet,
    title: 'Resumo do contrato',
    description: 'O frontend expõe fonte do resumo e deixa claro quando os dados são mock ou configurados.',
    status: 'demo-safe',
    tone: 'warning' as const,
  },
  {
    icon: Database,
    title: 'Hotspots centralizados',
    description: 'Os hotspots da demo estão centralizados em um arquivo de dados e servidos por uma API FastAPI.',
    status: 'api-backed',
    tone: 'success' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Comunicação honesta',
    description: 'A interface não vende produção pronta: apresenta o projeto como demo pública em evolução.',
    status: 'clear stage',
    tone: 'neutral' as const,
  },
];

export default function TransparencyPage() {
  const { data: networkStatus } = useNetworkStatus();
  const { data: deploymentStatus } = useDeploymentStatus();
  const { data: dataSources } = useDataSources();

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="transparency" tone="success" />
            <StatusPill label="public-facing" tone="neutral" />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Transparência da demo pública</h1>
          <p className="mt-4 text-zinc-400">
            Esta página resume o que já está funcional, o que ainda é demonstrativo e como o projeto está sendo preparado para
            uma apresentação pública mais robusta.
          </p>
        </div>

        <div className="mb-8">
          <PublicStatusStrip />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {transparencyItems.map((item) => (
            <Panel key={item.title}>
              <PanelBody className="p-6">
                <item.icon className="mb-4 h-9 w-9 text-emerald-400" />
                <div className="mb-3">
                  <StatusPill label={item.status} tone={item.tone} />
                </div>
                <h2 className="text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-sm text-zinc-400">{item.description}</p>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="Contrato e deployment" subtitle="Fonte usada pela demo" />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p><span className="text-zinc-500">Contract ID:</span> <span className="break-all text-white">{deploymentStatus?.contractId || 'não configurado'}</span></p>
              <p><span className="text-zinc-500">Source:</span> <span className="text-white">{deploymentStatus?.source ?? 'n/a'}</span></p>
              <p><span className="text-zinc-500">RPC:</span> <span className="break-all text-white">{deploymentStatus?.rpcUrl ?? 'n/a'}</span></p>
              <p><span className="text-zinc-500">WASM:</span> <span className="break-all text-white">{deploymentStatus?.deployment?.wasmHash ?? 'n/a'}</span></p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Fontes de dados" subtitle="Base atual da demo" />
            <PanelBody className="space-y-3 text-sm text-zinc-300">
              <p><span className="text-zinc-500">Hotspots ativos:</span> <span className="text-white">{dataSources?.hotspots.active ?? 'demo'}</span></p>
              <p><span className="text-zinc-500">Detector file:</span> <span className="break-all text-white">{dataSources?.hotspots.detectorFile ?? 'n/a'}</span></p>
              <p><span className="text-zinc-500">Indexed snapshot:</span> <span className="text-white">{String(dataSources?.events.indexedSnapshotAvailable ?? false)}</span></p>
              <p><span className="text-zinc-500">Deployment file:</span> <span className="break-all text-white">{dataSources?.deployment.deploymentFile ?? 'n/a'}</span></p>
            </PanelBody>
          </Panel>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="O que está funcional agora" subtitle="Bom para demonstração pública" />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>• Dashboard público com mapa, feed, painéis e KPIs.</li>
                <li>• FastAPI servindo hotspots, resumo agregado e status operacional.</li>
                <li>• Proxy do dashboard para API externa/local com fallback resiliente.</li>
                <li>• Consulta ao Pi RPC para status da rede e uso de snapshot indexado para eventos quando disponível.</li>
              </ul>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Próximos passos críticos" subtitle="Para aumentar credibilidade operacional" />
            <PanelBody>
              <ul className="space-y-3 text-sm text-zinc-300">
                <li>• Evoluir o indexador simples atual para persistência contínua com banco e histórico completo.</li>
                <li>• Ligar o fluxo de contrato Soroban real com assinatura e submissão.</li>
                <li>• Substituir dados demo por pipeline de ingestão reproduzível.</li>
                <li>• Adicionar provas públicas e histórico operacional por hotspot.</li>
              </ul>
            </PanelBody>
          </Panel>
        </div>

        <div className="mt-8">
          <Panel>
            <PanelHeader title="Navegação rápida" subtitle="Rotas úteis para a apresentação" />
            <PanelBody className="grid gap-3 md:grid-cols-3">
              {[
                { href: '/dashboard', label: 'Abrir dashboard' },
                { href: '/hotspots', label: 'Explorar hotspots' },
                { href: '/proofs', label: 'Abrir proofs' },
                { href: 'https://github.com/weedzinxd/pi-from-hungry', label: 'Repositório GitHub', external: true },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? '_blank' : undefined}
                  rel={item.external ? 'noreferrer' : undefined}
                  className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-emerald-500/40"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
