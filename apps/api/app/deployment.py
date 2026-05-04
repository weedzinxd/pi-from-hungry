import json
from pathlib import Path
from typing import Any


ROOT_DIR = Path(__file__).resolve().parents[3]
DEPLOYMENT_FILE = ROOT_DIR / 'deployments' / 'latest-deployment.json'
INDEXED_EVENTS_FILE = ROOT_DIR / 'data' / 'indexed-events.json'
BLOCKCHAIN_REGISTRATION_FILE = ROOT_DIR / 'backend-ia' / 'blockchain-registration.json'
DETECTOR_HOTSPOTS_FILE = ROOT_DIR / 'backend-ia' / 'hotspots_detectados.json'


def load_json_file(path: Path) -> dict[str, Any] | list[Any] | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (ValueError, TypeError):
        return None


def load_latest_deployment() -> dict[str, Any] | None:
    data = load_json_file(DEPLOYMENT_FILE)
    return data if isinstance(data, dict) else None


def load_blockchain_registration() -> dict[str, Any] | None:
    data = load_json_file(BLOCKCHAIN_REGISTRATION_FILE)
    return data if isinstance(data, dict) else None


def load_indexed_events_snapshot() -> dict[str, Any] | None:
    data = load_json_file(INDEXED_EVENTS_FILE)
    return data if isinstance(data, dict) else None


def detector_hotspots_available() -> bool:
    data = load_json_file(DETECTOR_HOTSPOTS_FILE)
    return isinstance(data, list) and len(data) > 0
