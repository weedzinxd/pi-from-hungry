# Plano de execução — próximos 7 dias

## Dia 1 — Toolchain Soroban local
- Instalar Rust
- Instalar target `wasm32-unknown-unknown`
- Validar `rustc`, `cargo`
- Rodar:
  - `cd contracts && cargo test`
  - `cd contracts && cargo build --target wasm32-unknown-unknown --release`

## Dia 2 — Fixes do contrato
- Corrigir incompatibilidades reais do `soroban-sdk`
- Garantir que testes passem
- Confirmar artifact `.wasm`

## Dia 3 — Deploy path real
- Ajustar script de deploy para artifact real
- Registrar operator/treasury
- Salvar `CONTRACT_ID` real em `deployments/latest-deployment.json`

## Dia 4 — Invoke path real
- Trocar preview por encoder de envelope real
- Integrar simulação + footprint + signer
- Submeter invocação de leitura ou chamada controlada

## Dia 5 — Dashboard conectada ao contrato
- Fazer o dashboard ler `CONTRACT_ID` real
- Exibir eventos reais
- Exibir resumo real sempre que disponível

## Dia 6 — Indexador leve
- Persistir cursor/ledger
- Salvar eventos e sumários em JSON ou banco leve
- Adicionar endpoint de histórico operacional

## Dia 7 — Hardening
- Melhorar empty/error/loading por painel
- Revisar docs
- Testar fluxo completo: deploy → invoke → dashboard

## Critério de sucesso da semana
- contrato compila
- WASM gerado
- contractId real configurado
- dashboard lê dados reais do contrato ao menos em um endpoint
- fluxo Soroban deixa de ser apenas preview
