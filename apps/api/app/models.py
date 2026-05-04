from typing import Literal
from pydantic import BaseModel


Severity = Literal['CRITICAL', 'HIGH', 'ELEVATED', 'MODERATE']
NetworkHealth = Literal['healthy', 'degraded', 'offline']
EventSource = Literal['rpc', 'indexer', 'fallback', 'unconfigured']
SummarySource = Literal['configured', 'mock']
ProofSource = Literal['registration-log', 'unconfigured']
DeploymentSource = Literal['deployment-file', 'environment', 'unconfigured']
HotspotSource = Literal['demo', 'detector', 'pipeline']


class LiveData(BaseModel):
    temperature: int
    humidity: int
    windSpeed: int
    drought: str


class CrisisEvent(BaseModel):
    id: str
    location: str
    country: str
    region: str
    severity: Severity
    affected: int
    piNeeded: int
    piDistributed: int
    peopleHelped: int
    description: str
    gvcActive: bool
    coordinates: tuple[float, float]
    satelliteUrl: str
    webcamUrl: str | None = None
    liveData: LiveData
    news: str
    analytics: dict[str, float | str] | None = None
    evidence: dict[str, str | list[str] | None] | None = None


class NetworkStatus(BaseModel):
    status: NetworkHealth
    latestLedger: int
    protocolVersion: int | None = None
    rpcUrl: str


class ParsedContractEvent(BaseModel):
    id: str
    ledger: int
    txHash: str
    topicLabel: str
    rawTopic: str
    successful: bool
    closedAt: str | None = None


class ContractEventsResponse(BaseModel):
    contractId: str
    latestLedger: int
    source: EventSource
    events: list[ParsedContractEvent]


class ContractSummaryTotals(BaseModel):
    hotspots: int
    totalPiNeeded: int
    totalPiDistributed: int
    totalPeopleHelped: int


class ContractSummaryResponse(BaseModel):
    contractId: str
    source: SummarySource
    totals: ContractSummaryTotals


class ProofRecord(BaseModel):
    id: str
    region: str
    txHash: str
    status: Literal['registered', 'pending']
    network: str
    recordedAt: str


class ProofsResponse(BaseModel):
    contractId: str
    source: ProofSource
    proofs: list[ProofRecord]


class DeploymentMetadata(BaseModel):
    wasmHash: str | None = None
    timestamp: str | None = None
    networkPassphrase: str | None = None
    ledger: int | None = None


class DeploymentStatusResponse(BaseModel):
    contractId: str
    network: str
    rpcUrl: str
    source: DeploymentSource
    deployment: DeploymentMetadata | None = None


class DataSourcesResponse(BaseModel):
    hotspots: dict[str, str]
    events: dict[str, str | bool]
    deployment: dict[str, str | bool]


class PublicStatusResponse(BaseModel):
    appName: str
    network: dict[str, str | int]
    deployment: dict[str, str]
    data: dict[str, str | bool | int]


class HotspotHistoryPoint(BaseModel):
    timestamp: str
    foodRiskScore: float
    operationalPriorityScore: float
    confidenceScore: float
    climateStressScore: float


class HotspotHistoryResponse(BaseModel):
    hotspotId: str
    source: Literal['history-file', 'derived', 'unavailable']
    trend: Literal['up', 'down', 'stable']
    points: list[HotspotHistoryPoint]


class AnalyticsRow(BaseModel):
    id: str
    location: str
    country: str
    severity: Severity
    foodRiskScore: float
    operationalPriorityScore: float
    confidenceScore: float
    climateStressScore: float
    precipitationAnomalyScore: float = 0.0
    ndviProxy: float = 0.0
    riskDelta: float = 0.0
    affected: int
    piNeeded: int


class AnalyticsOverviewResponse(BaseModel):
    source: Literal['pipeline', 'mixed', 'unavailable']
    totals: dict[str, int | float]
    ranking: list[AnalyticsRow]


class MoversOverviewResponse(BaseModel):
    source: Literal['history-file', 'derived', 'unavailable']
    topUp: list[AnalyticsRow]
    topDown: list[AnalyticsRow]


class AnalyticsInsightsResponse(BaseModel):
    source: Literal['pipeline', 'mixed', 'unavailable']
    insights: dict[str, str | int]


class PiAuthVerifyRequest(BaseModel):
    uid: str
    username: str
    accessToken: str


class PiAuthSessionResponse(BaseModel):
    source: Literal['demo-verify', 'unavailable']
    verified: bool
    session: dict[str, str | list[str]] | None
    note: str


class PiPaymentIntentCreateRequest(BaseModel):
    hotspotId: str
    hotspotLabel: str
    amountPi: float
    memo: str
    donorUsername: str


class PiPaymentIntent(BaseModel):
    paymentId: str
    hotspotId: str
    hotspotLabel: str
    amountPi: float
    memo: str
    donorUsername: str
    status: Literal['draft', 'pending_user_authorization', 'pending_server_approval', 'approved', 'completed', 'cancelled']
    createdAt: str
    network: str
    approvedAt: str | None = None
    completedAt: str | None = None
    txid: str | None = None
    note: str | None = None


class PiPaymentIntentsResponse(BaseModel):
    source: Literal['file-store', 'memory', 'unavailable']
    intents: list[PiPaymentIntent]


class PiPaymentIntentActionResponse(BaseModel):
    source: Literal['file-store', 'unavailable']
    intent: PiPaymentIntent | None
    note: str


class PiUserImpactResponse(BaseModel):
    source: Literal['file-store', 'unavailable']
    username: str
    totals: dict[str, int | float]
    badges: list[str]
    latestIntents: list[PiPaymentIntent]


class PiPaymentsOverviewResponse(BaseModel):
    source: Literal['file-store', 'derived', 'unavailable']
    totals: dict[str, int | float]


class PiPaymentsFeedResponse(BaseModel):
    source: Literal['file-store', 'unavailable']
    feed: list[PiPaymentIntent]
