export type Severity = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'MODERATE';

export interface CrisisEvent {
  id: string;
  location: string;
  country: string;
  region: string;
  severity: Severity;
  affected: number;
  piNeeded: number;
  piDistributed: number;
  peopleHelped: number;
  description: string;
  gvcActive: boolean;
  coordinates: [number, number];
  satelliteUrl: string;
  webcamUrl?: string;
  liveData: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    drought: string;
  };
  news: string;
  analytics?: {
    foodRiskScore: number;
    climateStressScore: number;
    operationalPriorityScore: number;
    confidenceScore: number;
    precipitationAnomalyScore?: number;
    ndviProxy?: number;
    sourceModelVersion: string;
    computedAt: string;
  };
  evidence?: {
    sources: string[];
    evidenceHash: string;
    weatherSource?: string;
    detectorTimestamp?: string;
  };
}

export interface NetworkStatus {
  status: 'healthy' | 'degraded' | 'offline';
  latestLedger: number;
  protocolVersion?: number;
  rpcUrl: string;
}

export interface DashboardKpis {
  totalAffected: number;
  totalHelped: number;
  totalPiDistributed: number;
  totalPiNeeded: number;
}
