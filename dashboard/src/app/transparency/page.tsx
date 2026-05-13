'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle2, Database, FileStack, ShieldCheck, Signal, Wallet } from 'lucide-react';
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
    description: 'Os hotspots da demo estão centralizados em um arquivo de dados e servidos por uma API ou fallback standalone.',
    status: 'resilient',
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

  const transparencySnapshot = [
    {
      icon: Signal,
      label: 'Network',
      value: networkStatus?.status ?? 'offline',
      helper: `ledger ${networkStatus?.latestLedger ?? 0}`,
      color: 'text-emerald-400',
    },
    {
      icon: ShieldCheck,
      label: 'Deployment',
      value: deploymentStatus?.source ?? 'unconfigured',
      helper: deploymentStatus?.contractId ? 'contract linked' : 'contract pending',
      color: 'text-cyan-400',
    },
    {
      icon: Database,
      label: 'Hotspots source',
      value: dataSources?.hotspots.active ?? 'demo',
      helper: dataSources?.events.indexedSnapshotAvailable ? 'indexed snapshot on' : 'indexed snapshot off',
      color: 'text-yellow-400',
    },
    {
      icon: FileStack,
      label: 'Evidence layer',
      value: dataSources?.deployment.available ? 'deployment file ready' : 'deployment file pending',
      helper: dataSources?.hotspots.pipelineFile ? 'pipeline data connected' : 'pipeline pending',
      color: 'text-emerald-300',
    },
  ];

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

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {transparencySnapshot.map((item) => (
            <Panel key={item.label} className="bg-zinc-950/80">
              <PanelBody className="p-5">
                <div className="mb-3 flex items-center gap-2">
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{item.label}</span>
                </div>
                <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                <p className="mt-1 text-xs text-zinc-500">{item.helper}</p>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {transparencyItems.map((item) => (
            <Panel key={item.title} className="card-hover">
              <PanelBody className="p-6">
                <item.icon className="mb-4 h-9 w-9 text-emerald-400" />
                <div className="mb-3">
                  <StatusPill label={item.status} tone={item.tone} />
                </div>
                <h2 className="text-xl font-bold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>
              </PanelBody>
            </Panel>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="Contrato e deployment" subtitle="Fonte usada pela demo" right={<CheckCircle2 className="h-4 w-4 text-emerald-400" />} />
            <PanelBody className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Contract ID', value: deploymentStatus?.contractId || 'não configurado', breakAll: true },
                { label: 'Source', value: deploymentStatus?.source ?? 'n/a' },
                { label: 'RPC', value: deploymentStatus?.rpcUrl ?? 'n/a', breakAll: true },
                { label: 'WASM', value: deploymentStatus?.deployment?.wasmHash ?? 'n/a', breakAll: true },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                  <p className={`mt-2 text-sm text-white ${item.breakAll ? 'break-all' : ''}`}>{item.value}</p>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Fontes de dados" subtitle="Base atual da demo" right={<Database className="h-4 w-4 text-cyan-400" />} />
            <PanelBody className="grid gap-3 sm:grid-cols-2">
              {[
                { label: 'Hotspots ativos', value: dataSources?.hotspots.active ?? 'demo' },
                { label: 'Indexed snapshot', value: String(dataSources?.events.indexedSnapshotAvailable ?? false) },
                { label: 'Detector file', value: dataSources?.hotspots.detectorFile ?? 'n/a', breakAll: true },
                { label: 'Deployment file', value: dataSources?.deployment.deploymentFile ?? 'n/a', breakAll: true },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                  <p className={`mt-2 text-sm text-white ${item.breakAll ? 'break-all' : ''}`}>{item.value}</p>
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Panel>
            <PanelHeader title="O que está funcional agora" subtitle="Bom para demonstração pública" />
            <PanelBody className="space-y-3">
              {[
                'Dashboard público com mapa, feed, painéis e KPIs.',
                'Camada standalone/read-only para publicar a demo sem depender de backend externo hoje.',
                'Proxy do dashboard para API externa/local com fallback resiliente.',
                'Consulta ao Pi RPC para status da rede e uso de snapshot indexado para eventos quando disponível.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">• {item}</div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Próximos passos críticos" subtitle="Para aumentar credibilidade operacional" />
            <PanelBody className="space-y-3">
              {[
                'Evoluir o indexador simples atual para persistência contínua com banco e histórico completo.',
                'Ligar o fluxo de contrato Soroban real com assinatura e submissão.',
                'Substituir dados demo por pipeline de ingestão reproduzível.',
                'Adicionar provas públicas e histórico operacional por hotspot.',
              ].map((item) => (
                <div key={item} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-300">• {item}</div>
              ))}
            </PanelBody>
          </Panel>
        </div>

        <div className="mt-8">
          <Panel>
            <PanelHeader title="Navegação rápida" subtitle="Rotas úteis para a apresentação" right={<ArrowRight className="h-4 w-4 text-emerald-400" />} />
            <PanelBody className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
