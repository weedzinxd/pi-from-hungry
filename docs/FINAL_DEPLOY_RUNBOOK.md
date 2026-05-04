# Final Deploy Runbook

## Objetivo
Publicar a demo pública do Pi From Hungry com backend FastAPI e frontend Next.js, com o menor atrito possível e com validação clara após o deploy.

---

## Estratégia recomendada
- **API**: Render
- **Dashboard**: Vercel
- **RPC**: Pi Testnet
- **Fonte de hotspots**: `API_HOTSPOTS_SOURCE=auto`
- **Contrato**: `CONTRACT_ID` real de testnet, se disponível

---

## Etapa 1 — revisar localmente
Na raiz do projeto:

```bash
npm install
npm --prefix dashboard install
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
npm run typecheck
npm --prefix dashboard run build
npm run indexer:events
```

Se quiser validar a demo local:

```bash
npm run api:dev
npm run dashboard:dev
npm run check:public-demo -- http://localhost:3000 http://localhost:8080
```

---

## Etapa 2 — preparar variáveis

### API (Render)
```env
PI_RPC_URL=https://rpc.testnet.minepi.com
SOROBAN_RPC_URL=https://rpc.testnet.minepi.com
NETWORK_PASSPHRASE=Pi Testnet
CONTRACT_ID=SEU_CONTRACT_ID_TESTNET
API_HOTSPOTS_SOURCE=auto
```

### Dashboard (Vercel)
```env
NEXT_PUBLIC_API_URL=https://SEU-SERVICO-API.onrender.com
API_URL=https://SEU-SERVICO-API.onrender.com
NEXT_PUBLIC_PI_RPC_URL=https://rpc.testnet.minepi.com
NEXT_PUBLIC_CONTRACT_ID=SEU_CONTRACT_ID_TESTNET
```

---

## Etapa 3 — publicar a API no Render
1. Entrar no Render.
2. Criar um novo **Web Service**.
3. Conectar o repositório.
4. Usar:
   - Build Command: `pip install -r apps/api/requirements.txt`
   - Start Command: `python3 -m uvicorn apps.api.main:app --host 0.0.0.0 --port $PORT`
5. Definir as variáveis da API.
6. Fazer deploy.

### Validar a API publicada
Abra:
- `/health`
- `/public-status`
- `/deployment-status`
- `/proofs`
- `/data-sources`

Exemplo:
```bash
curl https://SEU-SERVICO-API.onrender.com/health
```

---

## Etapa 4 — publicar o dashboard na Vercel
1. Entrar na Vercel.
2. Importar o repositório.
3. Selecionar a pasta **`dashboard`** como Root Directory.
4. Confirmar:
   - Framework: Next.js
   - Build Command: `npm run build`
5. Definir as variáveis do dashboard.
6. Fazer deploy.

### Validar o dashboard publicado
Abrir:
- `/`
- `/dashboard`
- `/hotspots`
- `/donations`
- `/proofs`
- `/status`
- `/launch`
- `/transparency`

---

## Etapa 5 — smoke test público
Após os dois deploys, rode localmente:

```bash
DASHBOARD_URL=https://SEU-DASHBOARD.vercel.app \
API_URL=https://SEU-SERVICO-API.onrender.com \
npm run check:public-demo
```

O ideal é que todos os checks passem.

---

## Etapa 6 — mensagem pública recomendada
Ao divulgar, use uma mensagem como:

> Pi From Hungry is a public testnet demo focused on transparency-first humanitarian coordination, combining dashboard observability, Pi RPC integration and Soroban-aligned architecture.

Em português:

> O Pi From Hungry é uma demo pública em testnet focada em transparência, coordenação humanitária e observabilidade sobre a infraestrutura Pi/Soroban.

---

## Etapa 7 — checklist final antes de compartilhar o link
- [ ] `/health` responde
- [ ] `/public-status` responde
- [ ] home carregando corretamente
- [ ] dashboard carregando corretamente
- [ ] proofs visíveis ou empty-state honesto
- [ ] launch page carregando
- [ ] disclaimers de demo/testnet visíveis
- [ ] links GitHub/social funcionando

---

## Se algo falhar
### Dashboard sem dados
Verificar:
- `NEXT_PUBLIC_API_URL`
- `API_URL`
- CORS no backend

### API sem contrato
Verificar:
- `CONTRACT_ID`
- `deployments/latest-deployment.json`

### Eventos vazios
Verificar:
- `npm run indexer:events`
- janela de retenção do RPC
- contract id correto
