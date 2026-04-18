# Soroban workflow prático

## 1. Preparar ambiente
```bash
npm run pi:soroban:guide
# siga docs/SETUP_RUST_SOROBAN.md
```

## 2. Compilar contrato
```bash
cd contracts
cargo test
cargo build --target wasm32-unknown-unknown --release
```

## 3. Preparar deploy
Na raiz do projeto, com `.env` configurado:
```bash
npm run pi:soroban:prepare
```

## 4. Registrar deploy simulado / planejamento
```bash
npm run pi:soroban:deploy
```

## 5. Simular invocação de método
```bash
npm run pi:soroban:invoke -- get_hotspot_summary '[0]'
```

## 5.1 Atalhos operacionais
```bash
npm run pi:soroban:summary -- 0
npm run pi:soroban:events -- 0 20
npm run pi:soroban:register:simulate -- G_OPERATOR ipfs://loc 7 9500 10000000 ipfs://evidence
npm run pi:soroban:donate:simulate -- G_DONOR 0 10000000 ipfs://memo
npm run pi:soroban:get-donation -- 0 0
npm run pi:soroban:xdr-preview -- get_hotspot_summary '[0]'
```

## 6. Quando integrar signer real
Fluxo esperado:
1. gerar envelope da invocação;
2. simular para footprint e recursos;
3. assinar com signer seguro;
4. enviar envelope assinado;
5. persistir tx hash e deployment metadata.

## 7. API do dashboard
O dashboard já possui endpoints internos para evolução operacional:

- `/api/hotspots`
- `/api/network-status`
- `/api/contract-events`
- `/api/contract-summary`

Isso facilita trocar mocks por um indexador real sem quebrar a UI.

## Arquivos centrais
- `src/soroban-client.ts`
- `src/deployment-store.ts`
- `scripts/prepare-soroban-deploy.ts`
- `scripts/deploy-soroban.ts`
- `scripts/invoke-soroban.ts`
