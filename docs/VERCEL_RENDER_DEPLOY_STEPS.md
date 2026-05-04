# Vercel + Render deploy steps

## 1. API no Render
1. Crie um novo Web Service no Render.
2. Conecte o repositório.
3. Use:
   - Build Command: `pip install -r apps/api/requirements.txt`
   - Start Command: `python3 -m uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT`
4. Configure envs:
   - `PI_RPC_URL=https://rpc.testnet.minepi.com`
   - `SOROBAN_RPC_URL=https://rpc.testnet.minepi.com`
   - `CONTRACT_ID=...` (opcional, mas recomendado)
   - `API_HOTSPOTS_SOURCE=auto`
5. Deploy e valide:
   - `/health`
   - `/public-status`
   - `/proofs`

## 2. Dashboard na Vercel
1. Crie novo projeto Vercel apontando para a pasta `dashboard`.
2. O `vercel.json` já está preparado.
3. Configure envs:
   - `NEXT_PUBLIC_API_URL=https://SEU-RENDER.onrender.com`
   - `API_URL=https://SEU-RENDER.onrender.com`
   - `NEXT_PUBLIC_PI_RPC_URL=https://rpc.testnet.minepi.com`
   - `NEXT_PUBLIC_CONTRACT_ID=...`
4. Faça deploy.
5. Valide:
   - `/`
   - `/dashboard`
   - `/proofs`
   - `/transparency`

## 3. Pós-deploy
- Rodar `npm run indexer:events` localmente ou em worker separado
- Atualizar `data/indexed-events.json`
- Revisar disclaimers públicos
- Adicionar domínio customizado
