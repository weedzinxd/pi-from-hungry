# Roadmap Técnico — Pi From Hungry

## Princípio norteador

Objetivo: criar uma plataforma auditável de detecção de crise alimentar, coordenação de ajuda e prestação de contas on-chain usando arquitetura Soroban/Stellar-compatible, com suporte a integração Pi quando disponível e apropriada.

## Fase 0 — Estabilização do repositório (1-2 semanas)

### Objetivos
- zerar erros de build e typecheck;
- definir fonte de verdade tecnológica;
- documentar limites do MVP.

### Entregas
- [x] root `tsc` sem erros
- [x] dashboard com `build` ok
- [x] deploy script alinhado à trilha Soroban
- [ ] README revisado com arquitetura canônica
- [ ] marcar Solidity como legado/experimental

## Fase 1 — Contrato Soroban real (2-4 semanas)

### Objetivos
- tornar `contracts/HungerReliefAgent.rs` compilável e deployável;
- definir storage, eventos e auth de forma correta.

### Escopo
- `init(operator, treasury)`
- `register_hotspot(location_hash, severity, estimated_cost)`
- `donate(hotspot_id, donor, amount)` ou modelo tokenizado equivalente
- `distribute_aid(hotspot_id, proof_hash, amount)`
- `resolve_hotspot(hotspot_id)`
- `get_hotspot(id)`
- `list/open metrics`

### Critérios de pronto
- contrato compila para WASM;
- testes unitários Soroban passam;
- eventos possuem schema estável;
- `contractId` é persistido em `deployments/`.

## Fase 2 — SDK e integração de transações (2-4 semanas)

### Objetivos
- sair do modo mock para submit real;
- criar camada única para RPC, simulação, assinatura e envio.

### Entregas
- `src/pi-rpc.ts` com métodos necessários para simulação/submit/status
- `src/soroban-client.ts` para encode/decode de argumentos
- `src/blockchain-cli.ts` fazendo:
  - simulação
  - montagem da tx
  - assinatura externa/segura
  - submissão
  - polling do status
- `.env.example` com:
  - RPC URL
  - NETWORK_PASSPHRASE
  - CONTRACT_ID
  - OPERATOR_ADDRESS

### Critérios de pronto
- registro real de hotspot em testnet;
- leitura de eventos do contrato;
- falhas de rede e retry cobertos.

## Fase 3 — Indexador e trilha de auditoria (2-3 semanas)

### Objetivos
- garantir observabilidade total do sistema.

### Entregas
- indexador de eventos por ledger/cursor
- persistência local ou banco
- tabela de hotspots, doações, distribuições, proofs
- correlacionar:
  - hotspot detectado
  - hotspot registrado
  - doação recebida
  - ajuda distribuída

### Critérios de pronto
- dashboard deixa de depender de dados hardcoded;
- tudo mostrado na UI tem origem auditável.

## Fase 4 — Pipeline real de IA geoespacial (4-8 semanas)

### Objetivos
- trocar simulação por pipeline reprodutível.

### Fontes sugeridas
- NASA MODIS / VIIRS
- Sentinel-2
- CHIRPS / precipitação
- FAO / preços e risco alimentar
- ACLED / conflito
- WorldPop / densidade populacional

### Entregas
- ingestão por job agendado
- feature store simples
- score de severidade calibrado
- confidence score
- shapefile/geojson por hotspot
- prova de origem do dado

### Critérios de pronto
- cada hotspot contém:
  - coordenadas
  - janela temporal
  - features relevantes
  - score
  - confidence
  - hash da evidência

## Fase 5 — Provas de distribuição e parceiros (4-6 semanas)

### Objetivos
- provar impacto real no mundo físico.

### Entregas
- upload de proof bundle (IPFS/Arweave/outro)
- fotos, vídeos, recibos, geotag, timestamp
- score de confiabilidade do parceiro
- fluxo de aprovação multi-assinatura para distribuição

### Critérios de pronto
- nenhuma distribuição é marcada como concluída sem prova vinculada.

## Fase 6 — Open Mainnet readiness (4-12 semanas)

### Objetivos
- preparar o sistema para ambiente econômico real.

### Requisitos
- revisão legal e compliance
- política de custódia e chaves
- limites operacionais
- observabilidade e alertas
- gestão de incidentes
- auditoria externa do contrato
- políticas antifraude

### Critérios de pronto
- auditoria de contrato concluída
- runbooks operacionais escritos
- monitoramento e rollback definidos
- modelo econômico e comunicações públicas revisados

## Trilhas transversais

### Segurança
- segregação de chaves
- assinatura offline ou HSM
- rate limiting
- validação de inputs
- prova de origem dos dados

### Dados
- versionamento de datasets
- reprodutibilidade
- rastreabilidade de scoring
- política de retenção

### Produto
- explicar claramente o que é real, o que é estimado e o que é simbólico
- separar “valor humanitário” de “preço de mercado”

### GVC / narrativa econômica
- usar GVC como métrica interna de mobilização social, não como cotação oficial da rede
- registrar on-chain apenas valores efetivos nativos da rede e metadados auditáveis
- exibir equivalências humanitárias de forma transparente no dashboard

## Backlog imediato sugerido

1. revisar `contracts/HungerReliefAgent.rs`
2. criar `docs/ARCHITECTURE_SOROBAN.md`
3. criar `.env.example`
4. implementar cliente de deploy/invoke Soroban real
5. substituir dados hardcoded do dashboard por JSON/indexador
6. adicionar testes unitários e CI
