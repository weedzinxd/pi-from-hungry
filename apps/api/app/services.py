import base64
import json
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen
from uuid import uuid4

from pydantic import ValidationError

from .models import CrisisEvent, ParsedContractEvent, PiPaymentIntent


JSON_HEADERS = {'Content-Type': 'application/json'}


DETECTOR_REGION_MAP: dict[str, dict[str, str | int]] = {
    'Sahel, África': {
        'country': 'Mali, Niger, Burkina Faso',
        'region': 'Africa',
        'news': 'Detector pipeline marked the Sahel as critical due to climate stress and displacement.',
    },
    'Iêmen': {
        'country': 'Yemen',
        'region': 'Middle East',
        'news': 'Detector pipeline marked Yemen as critical due to conflict and food access constraints.',
    },
    'Sudão do Sul': {
        'country': 'South Sudan',
        'region': 'Africa',
        'news': 'Detector pipeline marked South Sudan as critical due to flooding and logistics fragility.',
    },
    'Afeganistão': {
        'country': 'Afghanistan',
        'region': 'Asia',
        'news': 'Detector pipeline marked Afghanistan as high urgency due to vulnerability and supply stress.',
    },
    'Haiti': {
        'country': 'Haiti',
        'region': 'Caribbean',
        'news': 'Detector pipeline marked Haiti as high urgency due to food inflation and instability.',
    },
}


def severity_from_detector(level: str) -> str:
    normalized = level.upper()
    if 'CR' in normalized:
        return 'CRITICAL'
    if 'ALTO' in normalized or 'HIGH' in normalized:
        return 'HIGH'
    if 'MOD' in normalized:
        return 'MODERATE'
    return 'ELEVATED'


def normalize_detector_hotspot(item: dict[str, Any], index: int) -> CrisisEvent:
    region_name = str(item.get('regiao', f'Region {index + 1}'))
    metadata = DETECTOR_REGION_MAP.get(region_name, {})
    score = float(item.get('score_fome', 0.5))
    estimated_pi = int(round(float(item.get('estimativa_custo_pi', 0)) * 10_000_000))
    people_helped = int(max(5000, estimated_pi // 5000))
    affected = int(max(50000, estimated_pi // 1000))
    description = (
        f'Hotspot derivado do detector de fome com score {score:.3f}. '
        'Resultado preparado para demonstração pública e futura auditoria on-chain.'
    )

    return CrisisEvent(
        id=f"detector-{index + 1:03d}",
        location=region_name,
        country=str(metadata.get('country', region_name)),
        region=str(metadata.get('region', 'Global')),
        severity=severity_from_detector(str(item.get('nivel_urgencia', 'ELEVATED'))),
        affected=affected,
        piNeeded=estimated_pi,
        piDistributed=int(estimated_pi * 0.18),
        peopleHelped=people_helped,
        description=description,
        gvcActive=True,
        coordinates=(float(item.get('coordenadas', [0, 0])[0]), float(item.get('coordenadas', [0, 0])[1])),
        satelliteUrl='https://firms.modaps.eosdis.nasa.gov/',
        liveData={
            'temperature': 30 + (index * 2),
            'humidity': 20 + (index * 8),
            'windSpeed': 8 + (index * 3),
            'drought': 'HIGH' if score >= 0.8 else 'MODERATE',
        },
        news=str(metadata.get('news', 'Detector pipeline generated this hotspot as part of the demo dataset.')),
    )


def load_hotspots(
    data_file: Path,
    detector_file: Path | None = None,
    preferred_source: str = 'auto',
    pipeline_file: Path | None = None,
) -> tuple[list[CrisisEvent], str]:
    if pipeline_file and pipeline_file.exists() and preferred_source in {'auto', 'pipeline'}:
        with pipeline_file.open('r', encoding='utf-8') as file:
            raw_pipeline = json.load(file)
        if isinstance(raw_pipeline, list) and raw_pipeline:
            return [CrisisEvent.model_validate(item) for item in raw_pipeline], 'pipeline'

    if detector_file and detector_file.exists() and preferred_source in {'auto', 'detector'}:
        with detector_file.open('r', encoding='utf-8') as file:
            raw_detector = json.load(file)
        if isinstance(raw_detector, list) and raw_detector and isinstance(raw_detector[0], dict) and 'regiao' in raw_detector[0]:
            return [normalize_detector_hotspot(item, index) for index, item in enumerate(raw_detector)], 'detector'

    with data_file.open('r', encoding='utf-8') as file:
        raw = json.load(file)
    return [CrisisEvent.model_validate(item) for item in raw], 'demo'


def decode_topic(value: str) -> str:
    try:
        decoded_bytes = base64.b64decode(value)
        text = decoded_bytes.decode('utf-8', errors='ignore').replace('\x00', '').strip()
        return text or value
    except Exception:
        return value


def rpc_call(rpc_url: str, method: str, params: dict[str, Any] | None = None) -> Any:
    payload: dict[str, Any] = {
        'jsonrpc': '2.0',
        'id': 1,
        'method': method,
    }
    if params:
        payload['params'] = params

    body = json.dumps(payload).encode('utf-8')
    request = Request(rpc_url, data=body, headers=JSON_HEADERS, method='POST')

    try:
        with urlopen(request, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
    except URLError as exc:
        raise RuntimeError(str(exc)) from exc

    if data.get('error'):
        message = data['error'].get('message', 'unknown rpc error')
        raise RuntimeError(message)

    return data.get('result')


def read_pi_payment_intents(file_path: Path) -> list[PiPaymentIntent]:
    if not file_path.exists():
        return []

    try:
        with file_path.open('r', encoding='utf-8') as file:
            raw = json.load(file)
    except (json.JSONDecodeError, OSError):
        return []

    if not isinstance(raw, list):
        return []

    intents: list[PiPaymentIntent] = []
    for item in raw:
        try:
            intents.append(PiPaymentIntent.model_validate(item))
        except ValidationError:
            continue
    return intents


def save_pi_payment_intents(file_path: Path, intents: list[PiPaymentIntent]) -> None:
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with file_path.open('w', encoding='utf-8') as file:
        json.dump([item.model_dump() for item in intents], file, ensure_ascii=False, indent=2)



def append_pi_payment_intent(file_path: Path, payload: dict[str, Any]) -> PiPaymentIntent:
    existing = read_pi_payment_intents(file_path)
    file_path.parent.mkdir(parents=True, exist_ok=True)

    intent = PiPaymentIntent(
        paymentId=f"pi-demo-{uuid4().hex[:12]}",
        hotspotId=str(payload.get('hotspotId', '')),
        hotspotLabel=str(payload.get('hotspotLabel', 'Unknown hotspot')),
        amountPi=round(float(payload.get('amountPi', 0)), 4),
        memo=str(payload.get('memo', '')),
        donorUsername=str(payload.get('donorUsername', 'anonymous')),
        status='pending_server_approval',
        createdAt=datetime.now(UTC).isoformat(),
        network='Pi Testnet',
        note='Demo payment intent created from Pi mini-app flow.',
    )

    existing.insert(0, intent)
    save_pi_payment_intents(file_path, existing)

    return intent



def update_pi_payment_intent(file_path: Path, payment_id: str, action: str) -> PiPaymentIntent | None:
    intents = read_pi_payment_intents(file_path)
    target_index = next((index for index, item in enumerate(intents) if item.paymentId == payment_id), None)
    if target_index is None:
        return None

    current = intents[target_index]
    now = datetime.now(UTC).isoformat()

    if action == 'approve':
        updated = current.model_copy(update={
            'status': 'approved',
            'approvedAt': now,
            'note': 'Demo server approval completed. Ready for Pi payment completion callback.',
        })
    elif action == 'complete':
        updated = current.model_copy(update={
            'status': 'completed',
            'approvedAt': current.approvedAt or now,
            'completedAt': now,
            'txid': current.txid or f"demo-tx-{uuid4().hex[:10]}",
            'note': 'Demo payment marked as completed. Replace with official Pi completion callback in production.',
        })
    elif action == 'cancel':
        updated = current.model_copy(update={
            'status': 'cancelled',
            'note': 'Intent cancelled in demo flow.',
        })
    else:
        return None

    intents[target_index] = updated
    save_pi_payment_intents(file_path, intents)
    return updated


def parse_contract_event(event: dict[str, Any]) -> ParsedContractEvent:
    raw_topic = 'unknown'
    if isinstance(event.get('topic'), list) and event['topic']:
        raw_topic = str(event['topic'][0])

    return ParsedContractEvent(
        id=str(event.get('id', '')),
        ledger=int(event.get('ledger', 0)),
        txHash=str(event.get('txHash', 'tx n/a')),
        topicLabel=decode_topic(raw_topic),
        rawTopic=raw_topic,
        successful=bool(event.get('inSuccessfulContractCall', False)),
        closedAt=str(event.get('ledgerClosedAt')) if event.get('ledgerClosedAt') else None,
    )
