# Pi From Hungry — Auditoria Técnica

Data: 2026-04-02

## Resumo executivo

O projeto tem uma visão forte, documentação pública convincente e um MVP funcional em partes. Porém, o repositório ainda estava misturando três estágios diferentes:

1. narrativa Soroban/Stellar/Pi;
2. protótipo Solidity/Hardhat;
3. integrações simuladas para detector, dashboard e registro on-chain.

A correção imediata foi focada em:

- remover erros de TypeScript na raiz;
- fazer o dashboard gerar build de produção com sucesso;
- reposicionar o deploy para a trilha canônica Soroban/Stellar-style;
- registrar um plano técnico para evolução até Open Mainnet.

## O que foi encontrado

### 1. Inconsistência de stack blockchain

- `contracts/HungerReliefAgent.sol` coexistia com `contracts/HungerReliefAgent.rs`.
- `hardhat.config.ts` e `scripts/deploy-pi.ts` apontavam para uma linha EVM/Hardhat.
- README e visão do produto apontam para Soroban/Stellar/Pi RPC.

### 2. Erros de TypeScript

Encontrados em:

- `src/pi-rpc.ts`
- `src/pi-network.ts`
- `src/blockchain-cli.ts`
- `scripts/deploy-pi.ts`
- raiz do projeto compilando arquivos do dashboard com o `tsconfig.json` errado

### 3. Dashboard não fechava build

O `dashboard/src/app/page.tsx` tinha:

- cleanup inválido de `useEffect` no carregamento do CSS do Leaflet;
- tipo `CrisisEvent | null | undefined` sendo passado onde era esperado `CrisisEvent | null`.

### 4. Deploy irrealista para Soroban/Pi

O script de deploy dependia de Hardhat/Ethers, o que não representa a trilha correta para um contrato Rust/Soroban em ambiente Stellar-style.

### 5. Registro on-chain ainda é mock

`src/blockchain-cli.ts` ainda simula `txHash` e submissão.

### 6. Backend IA ainda é MVP simulado

`backend-ia/detector-fome.py` trabalha com lista fixa de regiões e aleatoriedade.

## Correções aplicadas nesta rodada

### TypeScript / Build

- `tsconfig.json`
  - separado para Node-side tooling;
  - dashboard excluído da compilação da raiz;
  - `include/exclude` definidos;
  - `types: ["node"]` adicionado.

- `src/pi-rpc.ts`
  - correção da checagem de `params`;
  - validação `response.ok`;
  - cast explícito do JSON para `RpcResponse<T>`.

- `src/pi-network.ts`
  - remoção de acesso indevido à propriedade privada `rpc`.

- `src/blockchain-cli.ts`
  - adicionado `getClient()`;
  - removidos acessos indevidos ao membro privado `rpc`.

- `dashboard/src/app/page.tsx`
  - cleanup do `useEffect` corrigido;
  - `selectedEvent` normalizado para `null`.

- `scripts/deploy-pi.ts`
  - substituído deploy Hardhat por gerador de plano de deploy Soroban.

- `package.json`
  - `pi:deploy` agora aponta para `scripts/deploy-pi.ts`;
  - `typecheck` adicionado;
  - `dashboard:build` adicionado;
  - `test` agora valida TypeScript + build do dashboard.

## Status após correções

### Verificações executadas

- `npx tsc --noEmit` ✅
- `cd dashboard && npm run build` ✅

## Gap técnico restante

### Blockchain

Ainda faltam:

- compilar `contracts/HungerReliefAgent.rs` para WASM Soroban;
- revisar o contrato Rust para compatibilidade real com Soroban SDK atual;
- criar fluxo real de `invokeHostFunction` / deploy assinado;
- armazenar `contractId`, passphrase, network e operadores;
- suportar Open Mainnet somente após compliance e acesso oficial.

### IA

Ainda faltam:

- pipeline de ingestão de dados reais;
- modelo reproduzível;
- versão de features;
- validação geoespacial;
- trilha de evidência auditável.

### Produto / governança

Ainda faltam:

- política transparente para o uso do conceito GVC;
- distinção entre valor humanitário interno e preço de mercado;
- fluxo de provas de entrega;
- governança e elegibilidade de operadores.

## Direção recomendada

### Fonte de verdade canônica

A fonte de verdade do projeto deve passar a ser:

- **contrato:** `contracts/HungerReliefAgent.rs`
- **rede-alvo:** Soroban/Stellar-compatible
- **integração de observabilidade:** Pi RPC / eventos / ledger
- **contrato Solidity:** legado/protótipo, não canônico

### Tratamento do GVC

Recomendação de arquitetura e comunicação:

- não tratar GVC como preço oficial de mercado;
- tratar como **unidade interna de impacto humanitário** do projeto;
- manter todas as doações e auditorias on-chain em valores nativos reais da rede;
- manter a camada GVC apenas como métrica social derivada e transparente.

Isso reduz risco jurídico, reputacional e técnico.

## Prioridades

1. estabilizar contrato Soroban real;
2. implementar submissão/invocação real de transações;
3. indexar eventos e provas de distribuição;
4. trocar detector mock por pipeline real;
5. preparar trilha de conformidade para Open Mainnet.
