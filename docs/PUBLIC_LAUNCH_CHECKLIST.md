# Public Launch Checklist

## 1. Environment
- [ ] `CONTRACT_ID` configured
- [ ] `PI_RPC_URL` configured
- [ ] `SOROBAN_RPC_URL` configured
- [ ] `NEXT_PUBLIC_API_URL` configured
- [ ] `NEXT_PUBLIC_PI_RPC_URL` configured

## 2. Data integrity
- [ ] `backend-ia/hotspots_detectados.json` reviewed
- [ ] `data/demo-hotspots.json` reviewed
- [ ] `data/indexed-events.json` refreshed with `npm run indexer:events`
- [ ] `backend-ia/blockchain-registration.json` reviewed

## 3. Public pages
- [ ] `/` opens correctly
- [ ] `/dashboard` loads KPIs and observability
- [ ] `/hotspots` lists active hotspots
- [ ] `/proofs` shows records or clear empty-state
- [ ] `/transparency` shows data sources and deployment info

## 4. Technical checks
- [ ] `npm run typecheck`
- [ ] `npm --prefix dashboard run build`
- [ ] `GET /health`
- [ ] `GET /network-status`
- [ ] `GET /deployment-status`
- [ ] `GET /contract-events`
- [ ] `GET /proofs`

## 5. Communication
- [ ] Testnet disclaimer visible
- [ ] Demo/public status clearly described
- [ ] GitHub repository link visible
- [ ] Contact/social links verified
