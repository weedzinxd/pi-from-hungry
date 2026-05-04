# Pi From Hungry API

Backend FastAPI para a demo pública do projeto.

## Endpoints
- `GET /health`
- `GET /hotspots`
- `GET /hotspots/{id}`
- `GET /network-status`
- `GET /contract-events`
- `GET /contract-summary`

Quando `data/indexed-events.json` estiver disponível, a API prioriza esse snapshot indexado para os eventos do contrato.

## Rodando localmente
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
uvicorn apps.api.main:app --reload --host 0.0.0.0 --port 8080
```

A API lê dados demo de `data/demo-hotspots.json` e consulta a Pi Testnet RPC para status da rede e eventos do contrato quando `CONTRACT_ID` estiver configurado.
