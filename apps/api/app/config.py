from functools import lru_cache
from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parents[3]
DEFAULT_DATA_FILE = ROOT_DIR / 'data' / 'demo-hotspots.json'
DEFAULT_DETECTOR_FILE = ROOT_DIR / 'backend-ia' / 'hotspots_detectados.json'
DEFAULT_PIPELINE_FILE = ROOT_DIR / 'data' / 'curated-hotspots.json'
DEFAULT_HISTORY_FILE = ROOT_DIR / 'data' / 'hotspot-history.json'
DEFAULT_PI_PAYMENT_INTENTS_FILE = ROOT_DIR / 'data' / 'pi-payment-intents.json'


class Settings(BaseSettings):
    app_name: str = 'Pi From Hungry API'
    app_env: str = 'development'
    api_host: str = '0.0.0.0'
    api_port: int = 8080
    api_cors_origins: list[str] = Field(default_factory=lambda: ['http://localhost:3000'])
    pi_rpc_url: str = 'https://rpc.testnet.minepi.com'
    contract_id: str = ''
    api_data_file: Path = DEFAULT_DATA_FILE
    detector_data_file: Path = DEFAULT_DETECTOR_FILE
    pipeline_data_file: Path = DEFAULT_PIPELINE_FILE
    history_data_file: Path = DEFAULT_HISTORY_FILE
    pi_payment_intents_file: Path = DEFAULT_PI_PAYMENT_INTENTS_FILE
    api_hotspots_source: str = 'auto'

    model_config = SettingsConfigDict(
        env_file=ROOT_DIR / '.env',
        env_file_encoding='utf-8',
        extra='ignore',
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
