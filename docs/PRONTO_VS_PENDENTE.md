# Pronto vs Pendente — Pi From Hungry

Atualizado em: 2026-04-02

## ✅ Pronto agora

### Repositório / build
- [x] TypeScript da raiz compila (`npx tsc --noEmit`)
- [x] Dashboard gera build de produção (`cd dashboard && npm run build`)
- [x] `npm test` valida typecheck + build do dashboard

### Soroban / contrato
- [x] Arquitetura canônica definida para Rust + Soroban
- [x] Projeto Rust estruturado em `contracts/`
- [x] Contrato canônico em `contracts/src/lib.rs`
- [x] Modelagem de `Hotspot`, `DonationRecord`, `HotspotSummary`
- [x] Métodos principais modelados (`init`, `register_hotspot`, `donate`, `distribute_aid`, `get_hotspot_summary`, etc.)
- [x] Testes básicos do contrato escritos no código fonte

### Soroban / toolchain e operação
- [x] Guia de setup local em `docs/SETUP_RUST_SOROBAN.md`
- [x] Workflow em `docs/SOROBAN_WORKFLOW.md`
- [x] Store de deployment em `src/deployment-store.ts`
- [x] Preflight de deploy em `scripts/prepare-soroban-deploy.ts`
- [x] Deploy planejado/simulado em `scripts/deploy-soroban.ts`
- [x] Cliente TypeScript Soroban em `src/soroban-client.ts`
- [x] Preview de envelope/XDR operacional
- [x] Scripts CLI de simulação:
  - [x] `pi:soroban:summary`
  - [x] `pi:soroban:events`
  - [x] `pi:soroban:register:simulate`
  - [x] `pi:soroban:donate:simulate`
  - [x] `pi:soroban:get-donation`
  - [x] `pi:soroban:xdr-preview`

### Dashboard enterprise-base
- [x] Providers globais com React Query
- [x] `loading.tsx` e `error.tsx`
- [x] Hooks de dados (`useHotspots`, `useNetworkStatus`, `useContractSummary`, `useContractEvents`)
- [x] API interna Next:
  - [x] `/api/hotspots`
  - [x] `/api/network-status`
  - [x] `/api/contract-summary`
  - [x] `/api/contract-events`
- [x] Componentização principal da home
- [x] Painéis operacionais de rede, resumo e eventos
- [x] Design system inicial (`Panel`, `StatusPill`, `MetricCard`, `EmptyState`, `Skeleton`)
- [x] Parsing básico de eventos para UI

## 🟡 Parcialmente pronto

### XDR / invocação real
- [x] Preview do envelope
- [x] Hash do envelope
- [x] JSON do envelope
- [ ] Envelope Stellar/Soroban real serializado em XDR válido
- [ ] Assinatura real
- [ ] Submissão real aceita pelo RPC

### Dashboard / contrato real
- [x] Painéis e APIs preparados
- [ ] `CONTRACT_ID` real configurado no dashboard
- [ ] Leituras reais exibidas na UI em vez de fallback/mock

### Contrato Soroban / compilação real
- [x] Estrutura pronta
- [ ] `cargo test` executado em máquina com Rust instalado
- [ ] `cargo build --target wasm32-unknown-unknown --release`
- [ ] WASM otimizado

## ❌ Ainda pendente

### On-chain real
- [ ] Deploy real do contrato
- [ ] `contractId` definitivo salvo após deploy real
- [ ] Fluxo real de eventos do contrato na UI
- [ ] Liquidação real de doação/distribuição

### IA real
- [ ] Pipeline geoespacial real
- [ ] Dados satelitais reais integrados
- [ ] Score reproduzível e auditável

### Enterprise full
- [ ] Autenticação / autorização para área operacional
- [ ] Observabilidade real (Sentry/telemetria)
- [ ] Testes automatizados do frontend
- [ ] Indexador persistente por ledger/cursor
- [ ] Banco para histórico de hotspots/eventos/doações
