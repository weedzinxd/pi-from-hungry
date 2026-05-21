import Link from 'next/link';
import { ArrowRight, Globe2, ShieldCheck, Satellite, Sparkles, Wallet } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { DataQualityShowcase } from '@/components/public/DataQualityShowcase';
import { PublicStatusStrip } from '@/components/public/PublicStatusStrip';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';

const pillars = [
  {
    icon: Satellite,
    title: 'Detecção orientada por dados',
    description: 'Hotspots geográficos, contexto climático e priorização operacional para demonstrar impacto com clareza.',
  },
  {
    icon: Wallet,
    title: 'Transparência on-chain',
    description: 'Integração com Pi Testnet / Soroban-style para registrar eventos auditáveis e mostrar trilha pública de execução.',
  },
  {
    icon: ShieldCheck,
    title: 'Demo pública confiável',
    description: 'Dashboard, API e documentação alinhados para apresentar o projeto ao público com linguagem honesta sobre o estágio atual.',
  },
];

const highlights = [
  'Dashboard operacional com mapas, KPIs e eventos de contrato',
  'API FastAPI para hotspots, resumo do contrato e status da rede',
  'Estrutura preparada para ingestão real e indexação futura',
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader />

      <main>
        <section className="border-b border-emerald-500/20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(6,182,212,0.18),transparent_20%)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:py-24">
            <div className="flex-1">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusPill label="public demo" tone="success" />
                <StatusPill label="pi testnet" tone="warning" />
                <StatusPill label="soroban path" tone="neutral" />
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
                Tecnologia humanitária para <span className="text-emerald-400">visibilidade</span>,{' '}
                <span className="text-cyan-400">coordenação</span> e{' '}
                <span className="text-yellow-400">transparência</span>.
              </h1>
              <p className="mt-5 max-w-2xl text-base text-zinc-300 md:text-lg">
                O Pi From Hungry é uma plataforma demonstrativa que combina dados críticos, visualização pública e rastreabilidade
                blockchain para apresentar como hotspots de insegurança alimentar podem ser priorizados e auditados.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 font-bold text-black transition hover:opacity-90"
                >
                  Abrir dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/transparency"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:border-emerald-500/40"
                >
                  Ver transparência
                </Link>
                <Link
                  href="/pi-app"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-3 font-semibold text-cyan-200 transition hover:border-cyan-400/60"
                >
                  Abrir Pi App Studio
                </Link>
              </div>

              <div className="mt-8 grid gap-3 md:grid-cols-3">
                {highlights.map((highlight) => (
                  <div key={highlight} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-300">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1">
              <Panel className="border-emerald-500/20 bg-zinc-950/90 shadow-2xl shadow-emerald-500/10">
                <PanelHeader
                  title="Resumo da demo pública"
                  subtitle="Base pronta para apresentar ao público e iterar com dados reais"
                  right={<Sparkles className="h-4 w-4 text-emerald-400" />}
                />
                <PanelBody className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Stack ativa</p>
                    <p className="mt-2 text-lg font-bold text-white">Next.js + FastAPI + Pi RPC</p>
                    <p className="mt-2 text-sm text-zinc-400">Frontend observável, API dedicada e integração com status/eventos da rede.</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Camada blockchain</p>
                    <p className="mt-2 text-lg font-bold text-white">Soroban-first</p>
                    <p className="mt-2 text-sm text-zinc-400">O repositório está sendo consolidado para a trilha canônica de contrato em Rust.</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Modo de operação</p>
                    <p className="mt-2 text-lg font-bold text-white">Demo pública honesta</p>
                    <p className="mt-2 text-sm text-zinc-400">Dados demo centralizados com possibilidade de evoluir para ingestão e indexação reais.</p>
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-black p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">Próximo marco</p>
                    <p className="mt-2 text-lg font-bold text-white">Indexador + provas</p>
                    <p className="mt-2 text-sm text-zinc-400">Eventos persistidos, transparência ampliada e páginas públicas de auditoria.</p>
                  </div>
                </PanelBody>
              </Panel>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="space-y-4">
            <PublicStatusStrip />
            <DataQualityShowcase />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14">
          <div className="mb-8 max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">Como funciona</p>
            <h2 className="text-3xl font-black text-white md:text-4xl">Três blocos para explicar o projeto em minutos</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <Panel key={pillar.title}>
                <PanelBody className="p-6">
                  <pillar.icon className="mb-4 h-10 w-10 text-emerald-400" />
                  <h3 className="text-xl font-bold text-white">{pillar.title}</h3>
                  <p className="mt-3 text-sm text-zinc-400">{pillar.description}</p>
                </PanelBody>
              </Panel>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <PanelHeader title="Apresentação pública" subtitle="O que já está pronto para demonstração" />
              <PanelBody className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="font-semibold text-white">Dashboard operacional</h3>
                  <p className="mt-2 text-sm text-zinc-400">Mapa, feed de hotspots, KPIs, resumo do contrato e eventos da rede.</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="font-semibold text-white">API dedicada</h3>
                  <p className="mt-2 text-sm text-zinc-400">Endpoints prontos para alimentar frontend, integrações e futuras automações.</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="font-semibold text-white">Narrativa clara</h3>
                  <p className="mt-2 text-sm text-zinc-400">O projeto comunica com honestidade que está em estágio de demo/testnet.</p>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <h3 className="font-semibold text-white">Base para escalar</h3>
                  <p className="mt-2 text-sm text-zinc-400">Estrutura compatível com indexador, dados geoespaciais e provas auditáveis.</p>
                </div>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader title="Explorar" subtitle="Páginas prontas para demo" right={<Globe2 className="h-4 w-4 text-cyan-400" />} />
              <PanelBody className="space-y-3">
                {[
                  { href: '/dashboard', label: 'Dashboard operacional' },
                  { href: '/hotspots', label: 'Hotspots ativos' },
                  { href: '/analytics', label: 'Analytics & ranking' },
                  { href: '/comparison', label: 'Temporal comparison' },
                  { href: '/pi-app', label: 'Pi App Studio shell' },
                  { href: '/donations', label: 'Doações e impacto' },
                  { href: '/proofs', label: 'Proofs & audit trail' },
                  { href: '/status', label: 'Public status' },
                  { href: '/methodology', label: 'Methodology & scoring' },
                  { href: '/launch', label: 'Launch readiness' },
                  { href: '/transparency', label: 'Transparência e status' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition hover:border-emerald-500/40 hover:text-white"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </PanelBody>
            </Panel>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
