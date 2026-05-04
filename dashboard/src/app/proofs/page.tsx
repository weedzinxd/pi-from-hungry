'use client';

import Link from 'next/link';
import { CheckCircle2, ExternalLink, FileBadge2 } from 'lucide-react';
import { AppFooter } from '@/components/layout/AppFooter';
import { AppHeader } from '@/components/layout/AppHeader';
import { Panel, PanelBody, PanelHeader } from '@/components/ui/Panel';
import { StatusPill } from '@/components/ui/StatusPill';
import { useDeploymentStatus } from '@/hooks/useDeploymentStatus';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useProofs } from '@/hooks/useProofs';

export default function ProofsPage() {
  const { data: proofsData } = useProofs();
  const { data: deploymentStatus } = useDeploymentStatus();
  const { data: networkStatus } = useNetworkStatus();

  return (
    <div className="min-h-screen bg-black text-white">
      <AppHeader networkStatus={networkStatus} />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-8 max-w-3xl">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill label="proofs" tone="success" />
            <StatusPill label={proofsData?.source ?? 'loading'} tone={proofsData?.source === 'registration-log' ? 'success' : 'warning'} />
          </div>
          <h1 className="text-4xl font-black md:text-5xl">Proofs & audit trail</h1>
          <p className="mt-4 text-zinc-400">
            Esta área pública apresenta registros de demonstração vinculados ao contrato configurado e à trilha operacional da demo.
          </p>
          <div className="mt-4">
            <Link href="/methodology" className="text-sm text-emerald-400 hover:text-emerald-300">
              Ver metodologia e scoring do pipeline →
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <PanelHeader title="Registros públicos" subtitle="Tx hashes de exemplo e regiões associadas" />
            <PanelBody className="space-y-3">
              {proofsData?.proofs?.length ? (
                proofsData.proofs.map((proof) => (
                  <div key={proof.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{proof.region}</p>
                        <p className="mt-1 break-all text-xs text-zinc-500">{proof.txHash}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <StatusPill label={proof.status} tone="success" />
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                      <span>Network: {proof.network}</span>
                      <span>Recorded at: {proof.recordedAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-sm text-zinc-400">
                  Nenhum proof disponível ainda. Configure um contrato real e gere registros para ampliar esta seção.
                </div>
              )}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Deployment" subtitle="Fonte do contrato exibido" right={<FileBadge2 className="h-4 w-4 text-cyan-400" />} />
            <PanelBody className="space-y-3 text-sm">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-zinc-500">Contract ID</p>
                <p className="mt-2 break-all text-white">{deploymentStatus?.contractId || 'não configurado'}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-zinc-500">Fonte</p>
                <p className="mt-2 text-white">{deploymentStatus?.source ?? 'n/a'}</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-zinc-500">RPC</p>
                <p className="mt-2 break-all text-white">{deploymentStatus?.rpcUrl ?? 'n/a'}</p>
              </div>
              <a
                href="https://github.com/weedzinxd/pi-from-hungry"
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold text-white hover:border-emerald-500/40"
              >
                Ver repositório <ExternalLink className="h-4 w-4" />
              </a>
            </PanelBody>
          </Panel>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
