# Setup para contrato real em testnet

## Objetivo
Conectar a demo ao contrato Soroban-style configurado em `deployments/latest-deployment.json` ou `CONTRACT_ID`.

## Fonte de verdade
A aplicação hoje resolve o contrato nesta ordem:
1. `CONTRACT_ID` no ambiente
2. `deployments/latest-deployment.json`

## Passos recomendados
1. gerar/validar deployment record
2. preencher `.env` com:
```env
CONTRACT_ID=SEU_CONTRACT_ID
PI_RPC_URL=https://rpc.testnet.minepi.com
SOROBAN_RPC_URL=https://rpc.testnet.minepi.com
NETWORK_PASSPHRASE=Pi Testnet
```
3. indexar eventos:
```bash
npm run indexer:events
```
4. abrir:
- `/dashboard`
- `/transparency`
- `/proofs`

## O que já está integrado
- `GET /deployment-status`
- `GET /contract-events`
- `GET /proofs`
- `GET /contract-summary`

## Próximo salto técnico
- substituir deploy simulado por envelope real assinado
- persistir indexação em banco
- correlacionar eventos reais com hotspots e provas de distribuição
