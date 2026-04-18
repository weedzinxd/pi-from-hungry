# Arquitetura Canônica — Soroban / Stellar-style / Pi From Hungry

## Decisão arquitetural

A arquitetura canônica do projeto passa a ser:

- **smart contract principal:** Rust + Soroban (`contracts/HungerReliefAgent.rs`)
- **camada de integração:** clientes TypeScript que falam com RPC compatível
- **indexação:** leitura de eventos e ledgers para auditoria
- **frontend:** Next.js consumindo dados indexados + leituras on-chain

## O que deixa de ser canônico

- `contracts/HungerReliefAgent.sol`
- fluxo Hardhat/Ethers como caminho principal

Esses artefatos podem ser mantidos como referência histórica ou protótipo, mas não devem guiar deploy em Soroban/Open Mainnet.

## Modelo de domínio

### Entidades principais

#### Hotspot
- id
- location_hash
- geojson_hash
- severity
- confidence
- estimated_cost
- evidence_hash
- status
- created_at
- created_by

#### Donation
- donor
- hotspot_id
- amount_native
- amount_usd_reference opcional
- impact_units opcional
- timestamp
- tx_hash

#### AidDistribution
- hotspot_id
- amount_native
- proof_hash
- partner_id
- approved_by
- timestamp

#### Partner
- id
- name
- region
- trust_score
- metadata_hash

## Eventos mínimos do contrato

- `hotspot_registered`
- `donation_received`
- `aid_distributed`
- `hotspot_resolved`
- `partner_updated` opcional

## Fluxo operacional

1. Pipeline IA detecta um hotspot.
2. O backend gera evidências e hashes.
3. O operador autorizado registra o hotspot no contrato.
4. Doadores financiam o hotspot.
5. Parceiro executa a ação em campo.
6. Prova da distribuição é anexada off-chain e referenciada on-chain.
7. Dashboard mostra estado consolidado a partir de eventos + banco indexado.

## GVC dentro da arquitetura

O conceito GVC pode existir como **impact metric** da aplicação, por exemplo:

- `impact_units`
- `food_years_enabled`
- `children_supported`

Mas não deve substituir o valor nativo liquidado on-chain.

## Recomendação de implementação

### Contrato
Manter o contrato pequeno, auditável e estável.
Tudo que for pesado deve ficar off-chain:

- imagens
- vídeo
- modelos ML
- shapefiles grandes
- documentação probatória

### Off-chain indexer
Responsável por:

- normalização dos eventos
- paginação histórica
- enriquecimento com metadados externos
- APIs consumidas pelo dashboard

### Dashboard
Mostrar claramente três camadas:

- **on-chain real**
- **evidência off-chain verificada**
- **métricas de impacto estimadas**

## Regras de comunicação pública

Nunca misturar:

- preço oficial de mercado;
- valor nativo on-chain;
- métrica social interna.

Exibir sempre rotulagem clara, por exemplo:

- `Doado on-chain: 10 PI`
- `Equivalência interna de impacto (PFH/GVC): ...`
- `Estimativa social, não cotação oficial`
