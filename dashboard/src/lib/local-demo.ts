import { promises as fs } from 'fs';
import path from 'path';
import { mockCrisisEvents } from '@/lib/mock-data';
import type { CrisisEvent } from '@/types/domain';
import type { PiPaymentIntent } from '@/hooks/usePiPaymentIntents';

function repoPath(...segments: string[]) {
  return path.join(process.cwd(), '..', ...segments);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadLocalHotspots(): Promise<{ hotspots: CrisisEvent[]; source: 'pipeline' | 'demo' }> {
  const curated = await readJsonFile<CrisisEvent[]>(repoPath('data', 'curated-hotspots.json'), []);
  if (curated.length) {
    return { hotspots: curated, source: 'pipeline' };
  }
  return { hotspots: mockCrisisEvents, source: 'demo' };
}

export async function loadLocalHistory(): Promise<Record<string, Array<Record<string, number | string>>>> {
  return readJsonFile<Record<string, Array<Record<string, number | string>>>>(repoPath('data', 'hotspot-history.json'), {});
}

export async function loadLocalProofs() {
  const registration = await readJsonFile<{ contract?: string; network?: string; timestamp?: string; results?: Array<Record<string, unknown>> }>(
    repoPath('backend-ia', 'blockchain-registration.json'),
    {},
  );

  const proofs = (registration.results ?? []).map((item, index) => ({
    id: `proof-${String(index + 1).padStart(3, '0')}`,
    region: String(item.region ?? 'unknown'),
    txHash: String(item.txHash ?? ''),
    status: item.success ? 'registered' : 'pending',
    network: String(registration.network ?? 'Pi Testnet'),
    recordedAt: String(registration.timestamp ?? ''),
  }));

  return {
    contractId: String(registration.contract ?? process.env.CONTRACT_ID ?? process.env.NEXT_PUBLIC_CONTRACT_ID ?? ''),
    source: proofs.length ? 'registration-log' : 'unconfigured',
    proofs,
  } as const;
}

export async function loadLocalContractSummary() {
  const { hotspots } = await loadLocalHotspots();
  return {
    contractId: process.env.CONTRACT_ID ?? process.env.NEXT_PUBLIC_CONTRACT_ID ?? '',
    source: 'mock' as const,
    totals: {
      hotspots: hotspots.length,
      totalPiNeeded: hotspots.reduce((acc, item) => acc + item.piNeeded, 0),
      totalPiDistributed: hotspots.reduce((acc, item) => acc + item.piDistributed, 0),
      totalPeopleHelped: hotspots.reduce((acc, item) => acc + item.peopleHelped, 0),
    },
  };
}

export async function loadLocalAnalyticsOverview() {
  const { hotspots, source } = await loadLocalHotspots();
  const history = await loadLocalHistory();
  const ranking = hotspots
    .map((item) => {
      const itemHistory = history[item.id] ?? [];
      const baseline = itemHistory[0];
      const foodRiskScore = Number(item.analytics?.foodRiskScore ?? 0);
      return {
        id: item.id,
        location: item.location,
        country: item.country,
        severity: item.severity,
        foodRiskScore,
        operationalPriorityScore: Number(item.analytics?.operationalPriorityScore ?? 0),
        confidenceScore: Number(item.analytics?.confidenceScore ?? 0),
        climateStressScore: Number(item.analytics?.climateStressScore ?? 0),
        precipitationAnomalyScore: Number(item.analytics?.precipitationAnomalyScore ?? 0),
        ndviProxy: Number(item.analytics?.ndviProxy ?? 0),
        riskDelta: baseline ? foodRiskScore - Number(baseline.foodRiskScore ?? foodRiskScore) : 0,
        affected: item.affected,
        piNeeded: item.piNeeded,
      };
    })
    .sort((a, b) => b.operationalPriorityScore - a.operationalPriorityScore || b.foodRiskScore - a.foodRiskScore);

  return {
    source: source === 'pipeline' ? 'pipeline' : 'mixed',
    totals: {
      hotspots: ranking.length,
      avgConfidence: ranking.length ? Number((ranking.reduce((acc, row) => acc + row.confidenceScore, 0) / ranking.length).toFixed(3)) : 0,
      avgRisk: ranking.length ? Number((ranking.reduce((acc, row) => acc + row.foodRiskScore, 0) / ranking.length).toFixed(3)) : 0,
      avgPriority: ranking.length ? Number((ranking.reduce((acc, row) => acc + row.operationalPriorityScore, 0) / ranking.length).toFixed(3)) : 0,
      totalAffected: ranking.reduce((acc, row) => acc + row.affected, 0),
      totalPiNeeded: ranking.reduce((acc, row) => acc + row.piNeeded, 0),
    },
    ranking,
  } as const;
}

export async function loadLocalMoversOverview() {
  const overview = await loadLocalAnalyticsOverview();
  const topUp = overview.ranking.filter((row) => row.riskDelta > 0.01).sort((a, b) => b.riskDelta - a.riskDelta).slice(0, 3);
  const topDown = overview.ranking.filter((row) => row.riskDelta < -0.01).sort((a, b) => a.riskDelta - b.riskDelta).slice(0, 3);
  return {
    source: topUp.length || topDown.length ? 'history-file' : 'derived',
    topUp,
    topDown,
  } as const;
}

export async function loadLocalAnalyticsInsights() {
  const overview = await loadLocalAnalyticsOverview();
  const movers = await loadLocalMoversOverview();
  const topHotspot = overview.ranking[0];
  const topMover = movers.topUp[0] ?? topHotspot;

  return {
    source: overview.source,
    insights: {
      criticalCount: overview.ranking.filter((row) => row.severity === 'CRITICAL').length,
      highPriorityCount: overview.ranking.filter((row) => row.operationalPriorityScore >= 0.75).length,
      topHotspotId: topHotspot?.id ?? '',
      topHotspotLabel: topHotspot?.location ?? 'n/a',
      topMoverId: topMover?.id ?? '',
      topMoverLabel: topMover?.location ?? 'n/a',
    },
  } as const;
}

export async function loadLocalHotspotHistory(id: string) {
  const history = await loadLocalHistory();
  const points = history[id] ?? [];
  if (points.length) {
    const first = Number(points[0].foodRiskScore ?? 0);
    const last = Number(points[points.length - 1].foodRiskScore ?? 0);
    const delta = last - first;
    return {
      hotspotId: id,
      source: 'history-file' as const,
      trend: delta > 0.03 ? 'up' as const : delta < -0.03 ? 'down' as const : 'stable' as const,
      points,
    };
  }

  const { hotspots } = await loadLocalHotspots();
  const hotspot = hotspots.find((item) => item.id === id);
  if (!hotspot?.analytics) {
    return { hotspotId: id, source: 'unavailable' as const, trend: 'stable' as const, points: [] };
  }

  return {
    hotspotId: id,
    source: 'derived' as const,
    trend: 'up' as const,
    points: [
      {
        timestamp: String(hotspot.analytics.computedAt),
        foodRiskScore: Number(hotspot.analytics.foodRiskScore ?? 0),
        operationalPriorityScore: Number(hotspot.analytics.operationalPriorityScore ?? 0),
        confidenceScore: Number(hotspot.analytics.confidenceScore ?? 0),
        climateStressScore: Number(hotspot.analytics.climateStressScore ?? 0),
      },
    ],
  };
}

export async function loadLocalPiPaymentIntents() {
  return readJsonFile<PiPaymentIntent[]>(repoPath('data', 'pi-payment-intents.json'), []);
}

export async function loadLocalPiPaymentsOverview() {
  const intents = await loadLocalPiPaymentIntents();
  const approved = intents.filter((item) => item.status === 'approved');
  const completed = intents.filter((item) => item.status === 'completed');
  return {
    source: 'file-store' as const,
    totals: {
      intents: intents.length,
      approved: approved.length,
      completed: completed.length,
      totalPi: Number(intents.reduce((acc, item) => acc + item.amountPi, 0).toFixed(4)),
      completedPi: Number(completed.reduce((acc, item) => acc + item.amountPi, 0).toFixed(4)),
      uniqueDonors: new Set(intents.map((item) => item.donorUsername.toLowerCase())).size,
    },
  };
}

export async function loadLocalPiPaymentsFeed(limit = 8) {
  const intents = await loadLocalPiPaymentIntents();
  return { source: 'file-store' as const, feed: intents.slice(0, limit) };
}

export async function loadLocalPiUserImpact(username: string) {
  const intents = await loadLocalPiPaymentIntents();
  const filtered = intents.filter((item) => item.donorUsername.toLowerCase() === username.toLowerCase());
  const completed = filtered.filter((item) => item.status === 'completed');
  const approved = filtered.filter((item) => item.status === 'approved');
  const badges: string[] = [];
  if (filtered.length) badges.push('Supporter');
  if (completed.length >= 1) badges.push('Finisher');
  if (completed.reduce((acc, item) => acc + item.amountPi, 0) >= 10) badges.push('Impact Builder');
  if (filtered.length >= 3) badges.push('Recurring Donor');

  return {
    source: 'file-store' as const,
    username,
    totals: {
      intents: filtered.length,
      approved: approved.length,
      completed: completed.length,
      totalPi: Number(filtered.reduce((acc, item) => acc + item.amountPi, 0).toFixed(4)),
      completedPi: Number(completed.reduce((acc, item) => acc + item.amountPi, 0).toFixed(4)),
    },
    badges,
    latestIntents: filtered.slice(0, 5),
  };
}

export async function loadLocalPublicStatus() {
  const { hotspots, source } = await loadLocalHotspots();
  const proofs = await loadLocalProofs();
  return {
    appName: 'Pi From Hungry',
    network: { status: 'healthy' as const, latestLedger: 0 },
    deployment: { contractId: process.env.NEXT_PUBLIC_CONTRACT_ID ?? '', source: 'unconfigured' as const },
    data: {
      hotspotsSource: source,
      indexedSnapshotAvailable: true,
      proofsCount: proofs.proofs.length,
      hotspotsCount: hotspots.length,
    },
  };
}
