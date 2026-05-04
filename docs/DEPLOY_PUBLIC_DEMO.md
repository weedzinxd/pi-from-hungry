# Deploy público da demo

## Objetivo
Publicar a demo com frontend Next.js e backend FastAPI, mantendo integração com Pi RPC e pages públicas de transparência.

## Opção 1: Docker Compose
```bash
cp .env.example .env
cp dashboard/.env.example dashboard/.env.local
docker compose up --build
```

URLs esperadas:
- Dashboard: `http://localhost:3000`
- API: `http://localhost:8080`

## Opção 2: Render
Arquivos preparados:
- `render.yaml`
- `apps/api/Dockerfile`
- `dashboard/Dockerfile`

Fluxo recomendado:
1. conectar o repositório no Render
2. aplicar `render.yaml`
3. configurar `CONTRACT_ID` real se disponível
4. publicar a API primeiro
5. publicar o dashboard com `NEXT_PUBLIC_API_URL`

## Opção 3: Vercel + Render/Railway
### Dashboard na Vercel
- Root: `dashboard`
- Build: `npm run build`
- Output: padrão Next.js
- Env:
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_PI_RPC_URL`
  - `NEXT_PUBLIC_CONTRACT_ID`

### API no Render ou Railway
- Start command:
```bash
python3 -m uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT
```
- Vars:
  - `PI_RPC_URL`
  - `SOROBAN_RPC_URL`
  - `CONTRACT_ID`
  - `API_HOTSPOTS_SOURCE=auto`

## Checklist profissional de publicação
- [ ] configurar `CONTRACT_ID`
- [ ] validar `/health`
- [ ] validar `/contract-events`
- [ ] validar `/proofs`
- [ ] rodar `npm run indexer:events`
- [ ] revisar disclaimer público de testnet/demo
- [ ] adicionar domínio customizado
