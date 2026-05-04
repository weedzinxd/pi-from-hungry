from contextlib import asynccontextmanager
from datetime import UTC, datetime
import json

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from apps.api.app.config import get_settings
from apps.api.app.deployment import (
    DEPLOYMENT_FILE,
    INDEXED_EVENTS_FILE,
    load_blockchain_registration,
    load_indexed_events_snapshot,
    load_latest_deployment,
)
from apps.api.app.models import (
    AnalyticsInsightsResponse,
    AnalyticsOverviewResponse,
    AnalyticsRow,
    ContractEventsResponse,
    ContractSummaryResponse,
    ContractSummaryTotals,
    DataSourcesResponse,
    DeploymentMetadata,
    DeploymentStatusResponse,
    HotspotHistoryPoint,
    HotspotHistoryResponse,
    NetworkStatus,
    ProofRecord,
    MoversOverviewResponse,
    PiAuthSessionResponse,
    PiAuthVerifyRequest,
    PiPaymentIntent,
    PiPaymentIntentActionResponse,
    PiPaymentIntentCreateRequest,
    PiPaymentIntentsResponse,
    PiPaymentsFeedResponse,
    PiPaymentsOverviewResponse,
    PiUserImpactResponse,
    ProofsResponse,
    PublicStatusResponse,
)
from apps.api.app.services import (
    append_pi_payment_intent,
    load_hotspots,
    parse_contract_event,
    read_pi_payment_intents,
    rpc_call,
    update_pi_payment_intent,
)


settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.api_cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
def health():
    return {
        'name': settings.app_name,
        'status': 'ok',
        'environment': settings.app_env,
    }


def resolve_contract_id() -> str:
    deployment = load_latest_deployment()
    return settings.contract_id or (str(deployment.get('contractId', '')) if deployment else '')


@app.get('/hotspots')
def get_hotspots():
    hotspots, _ = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )
    return hotspots


@app.get('/hotspots/{hotspot_id}')
def get_hotspot(hotspot_id: str):
    hotspots, _ = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )
    for hotspot in hotspots:
        if hotspot.id == hotspot_id:
            return hotspot
    raise HTTPException(status_code=404, detail=f'Hotspot {hotspot_id} not found')


@app.get('/network-status', response_model=NetworkStatus)
def get_network_status():
    try:
        health_result = rpc_call(settings.pi_rpc_url, 'getHealth')
        network_result = rpc_call(settings.pi_rpc_url, 'getNetwork')
        return NetworkStatus(
            status='healthy' if health_result.get('status') == 'healthy' else 'degraded',
            latestLedger=int(health_result.get('latestLedger', 0)),
            protocolVersion=int(network_result.get('protocolVersion', 0)),
            rpcUrl=settings.pi_rpc_url,
        )
    except RuntimeError:
        return NetworkStatus(
            status='offline',
            latestLedger=0,
            protocolVersion=None,
            rpcUrl=settings.pi_rpc_url,
        )


@app.get('/contract-events', response_model=ContractEventsResponse)
def get_contract_events(
    startLedger: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    indexed = load_indexed_events_snapshot()
    if indexed:
        indexed_contract_id = str(indexed.get('contractId', '') or '')
        raw_events = indexed.get('events', [])
        filtered_events = [
            parse_contract_event(event)
            for event in raw_events
            if int(event.get('ledger', 0)) >= startLedger
        ][:limit]
        if indexed_contract_id or filtered_events:
            return ContractEventsResponse(
                contractId=indexed_contract_id,
                latestLedger=int(indexed.get('latestLedger', 0)),
                source='indexer',
                events=filtered_events,
            )

    contract_id = resolve_contract_id()
    if not contract_id:
        return ContractEventsResponse(contractId='', latestLedger=0, source='unconfigured', events=[])

    try:
        result = rpc_call(
            settings.pi_rpc_url,
            'getEvents',
            {
                'startLedger': startLedger,
                'limit': limit,
                'type': 'contract',
            },
        )
        events = [
            parse_contract_event(event)
            for event in result.get('events', [])
            if event.get('contractId') == contract_id
        ]
        return ContractEventsResponse(
            contractId=contract_id,
            latestLedger=int(result.get('latestLedger', 0)),
            source='rpc',
            events=events,
        )
    except RuntimeError:
        return ContractEventsResponse(
            contractId=contract_id,
            latestLedger=0,
            source='fallback',
            events=[],
        )


@app.get('/contract-summary', response_model=ContractSummaryResponse)
def get_contract_summary():
    hotspots, _ = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )
    contract_id = resolve_contract_id()
    totals = ContractSummaryTotals(
        hotspots=len(hotspots),
        totalPiNeeded=sum(item.piNeeded for item in hotspots),
        totalPiDistributed=sum(item.piDistributed for item in hotspots),
        totalPeopleHelped=sum(item.peopleHelped for item in hotspots),
    )

    return ContractSummaryResponse(
        contractId=contract_id,
        source='configured' if contract_id else 'mock',
        totals=totals,
    )


@app.get('/deployment-status', response_model=DeploymentStatusResponse)
def get_deployment_status():
    deployment = load_latest_deployment()
    if deployment:
        return DeploymentStatusResponse(
            contractId=str(deployment.get('contractId', '')),
            network=str(deployment.get('network', 'Pi Testnet')),
            rpcUrl=str(deployment.get('rpcUrl', settings.pi_rpc_url)),
            source='deployment-file',
            deployment=DeploymentMetadata(
                wasmHash=deployment.get('wasmHash'),
                timestamp=deployment.get('timestamp'),
                networkPassphrase=deployment.get('networkPassphrase'),
                ledger=int(deployment['ledger']) if deployment.get('ledger') is not None else None,
            ),
        )

    if settings.contract_id:
        return DeploymentStatusResponse(
            contractId=settings.contract_id,
            network='Pi Testnet',
            rpcUrl=settings.pi_rpc_url,
            source='environment',
            deployment=None,
        )

    return DeploymentStatusResponse(
        contractId='',
        network='Pi Testnet',
        rpcUrl=settings.pi_rpc_url,
        source='unconfigured',
        deployment=None,
    )


@app.get('/proofs', response_model=ProofsResponse)
def get_proofs():
    registration = load_blockchain_registration()
    contract_id = resolve_contract_id()
    if not registration:
        return ProofsResponse(contractId=contract_id, source='unconfigured', proofs=[])

    proofs = [
        ProofRecord(
            id=f"proof-{index + 1:03d}",
            region=str(item.get('region', 'unknown')),
            txHash=str(item.get('txHash', '')),
            status='registered' if bool(item.get('success')) else 'pending',
            network=str(registration.get('network', 'Pi Testnet')),
            recordedAt=str(registration.get('timestamp', '')),
        )
        for index, item in enumerate(registration.get('results', []))
    ]

    return ProofsResponse(
        contractId=str(registration.get('contract', contract_id)),
        source='registration-log',
        proofs=proofs,
    )


@app.get('/data-sources', response_model=DataSourcesResponse)
def get_data_sources():
    _, hotspots_source = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )
    return DataSourcesResponse(
        hotspots={
            'active': hotspots_source,
            'demoFile': str(settings.api_data_file),
            'detectorFile': str(settings.detector_data_file),
            'pipelineFile': str(settings.pipeline_data_file),
        },
        events={
            'indexedSnapshotAvailable': INDEXED_EVENTS_FILE.exists(),
            'indexedEventsFile': str(INDEXED_EVENTS_FILE),
        },
        deployment={
            'deploymentFile': str(DEPLOYMENT_FILE),
            'available': DEPLOYMENT_FILE.exists(),
        },
    )


@app.get('/public-status', response_model=PublicStatusResponse)
def get_public_status():
    hotspots, hotspots_source = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )
    deployment = get_deployment_status()
    network = get_network_status()
    proofs = get_proofs()

    return PublicStatusResponse(
        appName=settings.app_name,
        network={
            'status': network.status,
            'latestLedger': network.latestLedger,
        },
        deployment={
            'contractId': deployment.contractId,
            'source': deployment.source,
        },
        data={
            'hotspotsSource': hotspots_source,
            'indexedSnapshotAvailable': INDEXED_EVENTS_FILE.exists(),
            'proofsCount': len(proofs.proofs),
            'hotspotsCount': len(hotspots),
        },
    )


@app.get('/analytics-overview', response_model=AnalyticsOverviewResponse)
def get_analytics_overview():
    hotspots, hotspots_source = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )

    history_map: dict[str, list[dict[str, float | str]]] = {}
    if settings.history_data_file.exists():
        try:
            history_map = json.loads(settings.history_data_file.read_text(encoding='utf-8'))
        except Exception:
            history_map = {}

    ranking = sorted(
        [
            AnalyticsRow(
                id=item.id,
                location=item.location,
                country=item.country,
                severity=item.severity,
                foodRiskScore=float(item.analytics['foodRiskScore']) if item.analytics else 0.0,
                operationalPriorityScore=float(item.analytics['operationalPriorityScore']) if item.analytics else 0.0,
                confidenceScore=float(item.analytics['confidenceScore']) if item.analytics else 0.0,
                climateStressScore=float(item.analytics['climateStressScore']) if item.analytics else 0.0,
                precipitationAnomalyScore=float(item.analytics.get('precipitationAnomalyScore', 0.0)) if item.analytics else 0.0,
                ndviProxy=float(item.analytics.get('ndviProxy', 0.0)) if item.analytics else 0.0,
                riskDelta=(
                    float(item.analytics['foodRiskScore']) - float(history_map.get(item.id, [{}])[0].get('foodRiskScore', item.analytics['foodRiskScore']))
                    if item.analytics and history_map.get(item.id)
                    else 0.0
                ),
                affected=item.affected,
                piNeeded=item.piNeeded,
            )
            for item in hotspots
        ],
        key=lambda row: (row.operationalPriorityScore, row.foodRiskScore, row.affected),
        reverse=True,
    )

    source = 'pipeline' if hotspots_source == 'pipeline' else 'mixed' if hotspots else 'unavailable'
    avg_confidence = round(sum(row.confidenceScore for row in ranking) / len(ranking), 3) if ranking else 0.0
    avg_risk = round(sum(row.foodRiskScore for row in ranking) / len(ranking), 3) if ranking else 0.0

    return AnalyticsOverviewResponse(
        source=source,
        totals={
            'hotspots': len(ranking),
            'avgConfidence': avg_confidence,
            'avgRisk': avg_risk,
            'avgPriority': round(sum(row.operationalPriorityScore for row in ranking) / len(ranking), 3) if ranking else 0.0,
            'totalAffected': sum(row.affected for row in ranking),
            'totalPiNeeded': sum(row.piNeeded for row in ranking),
        },
        ranking=ranking,
    )


@app.get('/movers-overview', response_model=MoversOverviewResponse)
def get_movers_overview():
    overview = get_analytics_overview()
    if not overview.ranking:
        return MoversOverviewResponse(source='unavailable', topUp=[], topDown=[])

    positive = [row for row in overview.ranking if row.riskDelta > 0.01]
    negative = [row for row in overview.ranking if row.riskDelta < -0.01]

    top_up = sorted(positive, key=lambda row: row.riskDelta, reverse=True)[:3]
    top_down = sorted(negative, key=lambda row: row.riskDelta)[:3]

    return MoversOverviewResponse(
        source='history-file' if top_up or top_down else 'derived',
        topUp=top_up,
        topDown=top_down,
    )


@app.get('/analytics-insights', response_model=AnalyticsInsightsResponse)
def get_analytics_insights():
    overview = get_analytics_overview()
    movers = get_movers_overview()
    if not overview.ranking:
        return AnalyticsInsightsResponse(
            source='unavailable',
            insights={
                'criticalCount': 0,
                'highPriorityCount': 0,
                'topHotspotId': '',
                'topHotspotLabel': 'n/a',
                'topMoverId': '',
                'topMoverLabel': 'n/a',
            },
        )

    top_hotspot = overview.ranking[0]
    top_mover = movers.topUp[0] if movers.topUp else top_hotspot
    critical_count = len([row for row in overview.ranking if row.severity == 'CRITICAL'])
    high_priority_count = len([row for row in overview.ranking if row.operationalPriorityScore >= 0.75])

    return AnalyticsInsightsResponse(
        source=overview.source,
        insights={
            'criticalCount': critical_count,
            'highPriorityCount': high_priority_count,
            'topHotspotId': top_hotspot.id,
            'topHotspotLabel': top_hotspot.location,
            'topMoverId': top_mover.id,
            'topMoverLabel': top_mover.location,
        },
    )


@app.post('/pi-auth/verify', response_model=PiAuthSessionResponse)
def verify_pi_auth(payload: PiAuthVerifyRequest):
    is_valid = bool(payload.uid.strip() and payload.username.strip() and payload.accessToken.strip())
    return PiAuthSessionResponse(
        source='demo-verify' if is_valid else 'unavailable',
        verified=is_valid,
        session={
            'uid': payload.uid,
            'username': payload.username,
            'scopes': ['username', 'payments'],
            'verifiedAt': datetime.now(UTC).isoformat(),
        } if is_valid else None,
        note='Demo verification only. Replace with Pi server-side auth verification before production use.' if is_valid else 'Missing fields for Pi auth verification.',
    )


@app.get('/pi-payments/intents', response_model=PiPaymentIntentsResponse)
def get_pi_payment_intents():
    intents = read_pi_payment_intents(settings.pi_payment_intents_file)
    return PiPaymentIntentsResponse(
        source='file-store' if settings.pi_payment_intents_file.exists() else 'memory',
        intents=intents,
    )


@app.post('/pi-payments/intents', response_model=PiPaymentIntent)
def create_pi_payment_intent(payload: PiPaymentIntentCreateRequest):
    if payload.amountPi <= 0 or payload.amountPi != payload.amountPi:
        raise HTTPException(status_code=400, detail='amountPi must be greater than zero')
    if not payload.hotspotId.strip():
        raise HTTPException(status_code=400, detail='hotspotId is required')
    if not payload.donorUsername.strip():
        raise HTTPException(status_code=400, detail='donorUsername is required')

    return append_pi_payment_intent(settings.pi_payment_intents_file, payload.model_dump())


@app.post('/pi-payments/intents/{payment_id}/approve', response_model=PiPaymentIntentActionResponse)
def approve_pi_payment_intent(payment_id: str):
    updated = update_pi_payment_intent(settings.pi_payment_intents_file, payment_id, 'approve')
    if not updated:
        raise HTTPException(status_code=404, detail=f'payment intent {payment_id} not found')

    return PiPaymentIntentActionResponse(
        source='file-store',
        intent=updated,
        note='Demo server approval completed.',
    )


@app.post('/pi-payments/intents/{payment_id}/complete', response_model=PiPaymentIntentActionResponse)
def complete_pi_payment_intent(payment_id: str):
    updated = update_pi_payment_intent(settings.pi_payment_intents_file, payment_id, 'complete')
    if not updated:
        raise HTTPException(status_code=404, detail=f'payment intent {payment_id} not found')

    return PiPaymentIntentActionResponse(
        source='file-store',
        intent=updated,
        note='Demo server completion completed.',
    )


@app.get('/pi-payments/overview', response_model=PiPaymentsOverviewResponse)
def get_pi_payments_overview():
    intents = read_pi_payment_intents(settings.pi_payment_intents_file)
    approved = [intent for intent in intents if intent.status == 'approved']
    completed = [intent for intent in intents if intent.status == 'completed']
    donors = {intent.donorUsername.lower() for intent in intents if intent.donorUsername}

    return PiPaymentsOverviewResponse(
        source='file-store' if settings.pi_payment_intents_file.exists() else 'unavailable',
        totals={
            'intents': len(intents),
            'approved': len(approved),
            'completed': len(completed),
            'totalPi': round(sum(intent.amountPi for intent in intents), 4),
            'completedPi': round(sum(intent.amountPi for intent in completed), 4),
            'uniqueDonors': len(donors),
        },
    )


@app.get('/pi-payments/feed', response_model=PiPaymentsFeedResponse)
def get_pi_payments_feed(limit: int = Query(default=8, ge=1, le=50)):
    intents = read_pi_payment_intents(settings.pi_payment_intents_file)
    return PiPaymentsFeedResponse(
        source='file-store' if settings.pi_payment_intents_file.exists() else 'unavailable',
        feed=intents[:limit],
    )


@app.get('/pi-payments/my-impact', response_model=PiUserImpactResponse)
def get_pi_user_impact(username: str = Query(default='', min_length=1)):
    intents = read_pi_payment_intents(settings.pi_payment_intents_file)
    filtered = [intent for intent in intents if intent.donorUsername.lower() == username.lower()]
    completed = [intent for intent in filtered if intent.status == 'completed']
    approved = [intent for intent in filtered if intent.status == 'approved']

    completed_pi = round(sum(intent.amountPi for intent in completed), 4)
    total_pi = round(sum(intent.amountPi for intent in filtered), 4)
    badges: list[str] = []
    if filtered:
        badges.append('Supporter')
    if len(completed) >= 1:
        badges.append('Finisher')
    if completed_pi >= 10:
        badges.append('Impact Builder')
    if len(filtered) >= 3:
        badges.append('Recurring Donor')

    return PiUserImpactResponse(
        source='file-store' if settings.pi_payment_intents_file.exists() else 'unavailable',
        username=username,
        totals={
            'intents': len(filtered),
            'approved': len(approved),
            'completed': len(completed),
            'totalPi': total_pi,
            'completedPi': completed_pi,
        },
        badges=badges,
        latestIntents=filtered[:5],
    )


@app.get('/hotspot-history/{hotspot_id}', response_model=HotspotHistoryResponse)
def get_hotspot_history(hotspot_id: str):
    if settings.history_data_file.exists():
        try:
            raw = settings.history_data_file.read_text(encoding='utf-8')
            history = json.loads(raw)
            points_raw = history.get(hotspot_id, [])
            if points_raw:
                points = [HotspotHistoryPoint(**point) for point in points_raw]
                if len(points) >= 2:
                    delta = points[-1].foodRiskScore - points[0].foodRiskScore
                    trend = 'up' if delta > 0.03 else 'down' if delta < -0.03 else 'stable'
                else:
                    trend = 'stable'
                return HotspotHistoryResponse(
                    hotspotId=hotspot_id,
                    source='history-file',
                    trend=trend,
                    points=points,
                )
        except Exception:
            pass

    hotspots, _ = load_hotspots(
        settings.api_data_file,
        settings.detector_data_file,
        settings.api_hotspots_source,
        settings.pipeline_data_file,
    )
    hotspot = next((item for item in hotspots if item.id == hotspot_id), None)
    if hotspot and hotspot.analytics:
        risk = float(hotspot.analytics['foodRiskScore'])
        priority = float(hotspot.analytics['operationalPriorityScore'])
        confidence = float(hotspot.analytics['confidenceScore'])
        climate = float(hotspot.analytics['climateStressScore'])
        points = [
            HotspotHistoryPoint(timestamp='2026-04-15T00:00:00Z', foodRiskScore=max(risk - 0.08, 0), operationalPriorityScore=max(priority - 0.07, 0), confidenceScore=max(confidence - 0.04, 0), climateStressScore=max(climate - 0.05, 0)),
            HotspotHistoryPoint(timestamp='2026-04-22T00:00:00Z', foodRiskScore=max(risk - 0.03, 0), operationalPriorityScore=max(priority - 0.02, 0), confidenceScore=max(confidence - 0.02, 0), climateStressScore=max(climate - 0.01, 0)),
            HotspotHistoryPoint(timestamp=str(hotspot.analytics['computedAt']), foodRiskScore=risk, operationalPriorityScore=priority, confidenceScore=confidence, climateStressScore=climate),
        ]
        return HotspotHistoryResponse(hotspotId=hotspot_id, source='derived', trend='up', points=points)

    return HotspotHistoryResponse(hotspotId=hotspot_id, source='unavailable', trend='stable', points=[])
