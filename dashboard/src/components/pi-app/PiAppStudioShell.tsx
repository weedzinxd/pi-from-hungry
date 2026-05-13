'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { CheckCircle2, ExternalLink, Flame, ShieldCheck, Smartphone, Sparkles, Wallet } from 'lucide-react';
import { PiImpactPassport } from '@/components/pi-app/PiImpactPassport';
import { PiJourneyPanel } from '@/components/pi-app/PiJourneyPanel';
import { PiMilestonesPanel } from '@/components/pi-app/PiMilestonesPanel';
import { PiMiniAppOnboarding } from '@/components/pi-app/PiMiniAppOnboarding';
import { PiPaymentsFeedPanel } from '@/components/pi-app/PiPaymentsFeedPanel';
import { PiPersonalTimeline } from '@/components/pi-app/PiPersonalTimeline';
import { PiRecommendedActionPanel } from '@/components/pi-app/PiRecommendedActionPanel';
import { useAnalyticsInsights } from '@/hooks/useAnalyticsInsights';
import { useHotspots } from '@/hooks/useHotspots';
import { usePiAuthSession } from '@/hooks/usePiAuthSession';
import { usePiBrowser } from '@/hooks/usePiBrowser';
import {
  useApprovePiPaymentIntent,
  useCompletePiPaymentIntent,
  useCreatePiPaymentIntent,
  usePiPaymentIntents,
} from '@/hooks/usePiPaymentIntents';
import { usePiUserImpact } from '@/hooks/usePiUserImpact';
import { useProofs } from '@/hooks/useProofs';
import { usePublicStatus } from '@/hooks/usePublicStatus';
import { dashboardConfig } from '@/lib/config';
import { formatNumber, formatPercent } from '@/lib/formatters';

export function PiAppStudioShell() {
  const { data: hotspots } = useHotspots();
  const { data: publicStatus } = usePublicStatus();
  const { data: proofs } = useProofs();
  const { data: insights } = useAnalyticsInsights();
  const { data: paymentIntents } = usePiPaymentIntents();
  const { sdkReady, loading, authenticating, user, isPiBrowser, authenticate } = usePiBrowser();
  const authSession = usePiAuthSession();
  const createPaymentIntent = useCreatePiPaymentIntent();
  const approvePaymentIntent = useApprovePiPaymentIntent();
  const completePaymentIntent = useCompletePiPaymentIntent();

  const critical = (hotspots ?? []).filter((item) => item.severity === 'CRITICAL').slice(0, 3);
  const featuredHotspots = critical.length ? critical : (hotspots ?? []).slice(0, 3);
  const topProofs = proofs?.proofs.slice(0, 3) ?? [];
  const recentIntents = paymentIntents?.intents.slice(0, 3) ?? [];
  const activeUsername = authSession.data?.session?.username ?? user?.username ?? 'preview-user';
  const impact = usePiUserImpact(activeUsername);

  const [selectedHotspotId, setSelectedHotspotId] = useState('');
  const [amountPi, setAmountPi] = useState('3.14');
  const [memo, setMemo] = useState('Support hotspot from Pi app demo');

  const selectedHotspot = useMemo(() => {
    const list = featuredHotspots.length ? featuredHotspots : hotspots ?? [];
    return list.find((item) => item.id === selectedHotspotId) ?? list[0] ?? null;
  }, [featuredHotspots, hotspots, selectedHotspotId]);

  async function handleConnect() {
    const result = await authenticate();
    if (!result) {
      return;
    }

    await authSession.mutateAsync({
      uid: result.user.uid,
      username: result.user.username,
      accessToken: result.accessToken,
    });
  }

  async function handleCreateIntent() {
    if (!selectedHotspot) {
      return;
    }

    await createPaymentIntent.mutateAsync({
      hotspotId: selectedHotspot.id,
      hotspotLabel: selectedHotspot.location,
      amountPi: Number(amountPi),
      memo,
      donorUsername: activeUsername,
    });
  }

  const pendingApproval = recentIntents.find((intent) => intent.status === 'pending_server_approval');
  const pendingCompletion = recentIntents.find((intent) => intent.status === 'approved');
  const latestIntent = recentIntents[0];
  const readOnlyCloudMode = !dashboardConfig.apiUrl || dashboardConfig.apiUrl.includes('localhost:8080');

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-black text-white">
      <div className="border-b border-emerald-500/20 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.24),transparent_38%),linear-gradient(180deg,#0a0a0a_0%,#09090b_100%)] px-5 pb-6 pt-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <Smartphone className="h-3.5 w-3.5" /> Pi App Studio / mobile shell
        </div>
        <h1 className="text-3xl font-black leading-tight">Pi From Hungry inside the Pi app</h1>
        <p className="mt-3 text-sm text-zinc-300">
          Mini experiência mobile-first para App Studio com foco em transparência, hotspots críticos, autenticação Pi e fluxo demonstrativo de doações.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-xs text-zinc-500">Hotspots ativos</p>
            <p className="mt-2 text-2xl font-black text-white">{publicStatus?.data.hotspotsCount ?? hotspots?.length ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4">
            <p className="text-xs text-zinc-500">Proofs indexadas</p>
            <p className="mt-2 text-2xl font-black text-white">{publicStatus?.data.proofsCount ?? proofs?.proofs.length ?? 0}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 px-4 py-5">
        <div id="session" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Pi Browser session</p>
              <p className="text-xs text-zinc-500">Auth preparada para App Studio, ainda em modo demo/testnet.</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${sdkReady ? 'bg-emerald-500/15 text-emerald-300' : 'bg-yellow-500/15 text-yellow-300'}`}>
              {loading ? 'loading' : sdkReady ? 'sdk ready' : 'preview mode'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-zinc-300">
            <p>• Ambiente Pi detectado: <span className="text-white">{isPiBrowser ? 'sim' : 'não / preview'}</span></p>
            <p>• Rede: <span className="text-white">Pi Testnet</span></p>
            <p>• Usuário SDK: <span className="text-white">{user?.username ?? 'não autenticado'}</span></p>
            <p>• Verificação backend: <span className="text-white">{authSession.data?.verified ? 'validada' : 'pendente'}</span></p>
          </div>

          <button
            type="button"
            onClick={handleConnect}
            disabled={!sdkReady || authenticating || authSession.isPending}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Wallet className="h-4 w-4" />
            {authenticating || authSession.isPending
              ? 'Conectando...'
              : user
                ? `Conectado como @${user.username}`
                : 'Conectar com Pi'}
          </button>

          <p className="mt-3 text-xs text-zinc-500">
            {authSession.data?.note ?? 'Esta verificação ainda é demo-safe e precisa de endurecimento server-side antes de uso real.'}
          </p>
          {readOnlyCloudMode ? (
            <p className="mt-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
              Cloud demo em modo somente leitura: ótimo para apresentação pública hoje. O fluxo de criação/aprovação segue disponível localmente ou quando conectarmos um backend persistente.
            </p>
          ) : null}
        </div>

        <PiMiniAppOnboarding />

        <PiRecommendedActionPanel verified={Boolean(authSession.data?.verified)} latestIntent={latestIntent} impact={impact.data} />

        <PiJourneyPanel verified={Boolean(authSession.data?.verified)} latestIntent={latestIntent} impact={impact.data} />

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 flex items-center gap-2 text-yellow-400">
              <Flame className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Risk</span>
            </div>
            <p className="text-2xl font-black text-white">{insights?.insights.criticalCount ?? 0}</p>
            <p className="text-xs text-zinc-500">hotspots críticos agora</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 flex items-center gap-2 text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">Priority</span>
            </div>
            <p className="text-2xl font-black text-white">{insights?.insights.highPriorityCount ?? 0}</p>
            <p className="text-xs text-zinc-500">alta prioridade operacional</p>
          </div>
        </div>

        <div id="donation-intent" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Create donation intent</h2>
              <p className="text-xs text-zinc-500">Fluxo inicial para Pi App Studio com backend demo de intents.</p>
            </div>
            <span className="rounded-full bg-cyan-500/15 px-2 py-1 text-[10px] font-semibold text-cyan-300">demo intent</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Hotspot</label>
              <select
                value={selectedHotspot?.id ?? ''}
                onChange={(event) => setSelectedHotspotId(event.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none"
              >
                {featuredHotspots.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.location}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Amount (Pi)</label>
                <input
                  value={amountPi}
                  onChange={(event) => setAmountPi(event.target.value)}
                  inputMode="decimal"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Donor</label>
                <input
                  value={activeUsername}
                  readOnly
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-zinc-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-zinc-500">Memo</label>
              <textarea
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 text-sm text-white outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleCreateIntent}
              disabled={!selectedHotspot || createPaymentIntent.isPending || readOnlyCloudMode}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" /> {readOnlyCloudMode ? 'Read-only cloud demo' : createPaymentIntent.isPending ? 'Criando intent...' : 'Criar intent de doação'}
            </button>
            <p className="text-xs text-zinc-500">
              A intent criada entra em <span className="text-white">pending_server_approval</span>. Agora a demo já tem ações separadas para <span className="text-white">approve</span> e <span className="text-white">complete</span>.
              {readOnlyCloudMode ? ' Na versão cloud de hoje, esta área fica travada em modo showcase/read-only.' : ''}
            </p>
            {createPaymentIntent.data ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                Intent criada: <span className="font-semibold">{createPaymentIntent.data.paymentId}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div id="server-actions" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Server actions</h2>
              <p className="text-xs text-zinc-500">Simulação das etapas backend de aprovação e conclusão.</p>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!pendingApproval || approvePaymentIntent.isPending || readOnlyCloudMode}
              onClick={() => pendingApproval && approvePaymentIntent.mutate(pendingApproval.paymentId)}
              className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm font-semibold text-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {approvePaymentIntent.isPending ? 'Aprovando...' : 'Approve latest intent'}
            </button>
            <button
              type="button"
              disabled={!pendingCompletion || completePaymentIntent.isPending || readOnlyCloudMode}
              onClick={() => pendingCompletion && completePaymentIntent.mutate(pendingCompletion.paymentId)}
              className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {completePaymentIntent.isPending ? 'Completando...' : 'Complete approved intent'}
            </button>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Isso acelera a validação do fluxo no preview público até ligarmos os callbacks oficiais do Pi Payments.
            {readOnlyCloudMode ? ' Hoje, em cloud, essa etapa fica desativada para evitar falsa sensação de produção.' : ''}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">My impact</h2>
              <p className="text-xs text-zinc-500">Resumo do pioneiro autenticado dentro do mini-app.</p>
            </div>
            <Wallet className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-zinc-500">Intents</p>
              <p className="mt-1 text-xl font-bold text-white">{impact.data?.totals.intents ?? 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-zinc-500">Completed Pi</p>
              <p className="mt-1 text-xl font-bold text-white">{impact.data?.totals.completedPi?.toFixed(2) ?? '0.00'}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-zinc-500">Approved</p>
              <p className="mt-1 text-xl font-bold text-white">{impact.data?.totals.approved ?? 0}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <p className="text-zinc-500">Completed</p>
              <p className="mt-1 text-xl font-bold text-white">{impact.data?.totals.completed ?? 0}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">Usuário ativo: <span className="text-white">@{activeUsername}</span></p>
          <div className="mt-4">
            <PiImpactPassport impact={impact.data} />
          </div>
          <div className="mt-4">
            <PiMilestonesPanel impact={impact.data} />
          </div>
          <Link href={`/pi-app/impact?username=${encodeURIComponent(activeUsername)}`} className="mt-4 inline-flex text-xs font-semibold text-cyan-400 hover:text-cyan-300">
            Abrir área dedicada de impacto
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Critical hotspots</h2>
              <p className="text-xs text-zinc-500">Seleção rápida para navegação mobile</p>
            </div>
            <Link href="/hotspots" className="text-xs text-emerald-400">
              ver todos
            </Link>
          </div>
          <div className="space-y-3">
            {featuredHotspots.map((item) => (
              <Link key={item.id} href={`/hotspots/${item.id}`} className="block rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.location}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.country}</p>
                  </div>
                  <span className="rounded-full bg-red-500/15 px-2 py-1 text-[10px] font-semibold text-red-300">{item.severity}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-zinc-500">Affected</p>
                    <p className="font-semibold text-white">{formatNumber(item.affected)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Pi needed</p>
                    <p className="font-semibold text-white">{formatNumber(item.piNeeded)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Priority</p>
                    <p className="font-semibold text-white">{formatPercent(item.analytics?.operationalPriorityScore ?? 0)}</p>
                  </div>
                </div>
              </Link>
            ))}
            {!featuredHotspots.length ? <p className="text-sm text-zinc-500">Nenhum hotspot disponível no momento.</p> : null}
          </div>
        </div>

        <PiPersonalTimeline impact={impact.data} />

        <PiPaymentsFeedPanel />

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Proofs recentes</h2>
              <p className="text-xs text-zinc-500">Sinais públicos que ajudam a demonstrar auditabilidade</p>
            </div>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="space-y-2">
            {topProofs.map((proof) => (
              <div key={proof.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <p className="font-semibold text-white">{proof.region}</p>
                <p className="mt-1 break-all text-[11px] text-zinc-500">{proof.txHash}</p>
              </div>
            ))}
            {!topProofs.length ? <p className="text-sm text-zinc-500">Sem proofs públicas no snapshot atual.</p> : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
          <Link href="/comparison" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm font-semibold text-white">
            Temporal comparison
          </Link>
          <Link href="/transparency" className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm font-semibold text-white">
            Transparency
          </Link>
          <a
            href="https://github.com/weedzinxd/pi-from-hungry"
            target="_blank"
            rel="noreferrer"
            className="col-span-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-sm font-semibold text-white"
          >
            GitHub / open source <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
