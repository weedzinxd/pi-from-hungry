# 🌍 Pi From Hungry

<!-- Badges -->
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/weedzinxd/pi-from-hungry?style=social)](https://github.com/weedzinxd/pi-from-hungry/stargazers)
[![Pi Network](https://img.shields.io/badge/Pi-Network%20Testnet-brightgreen)](https://minepi.com)
[![Soroban](https://img.shields.io/badge/Soroban-v23-blue)](https://soroban.stellar.org)
[![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)

<!-- Shields Custom -->
![Last Commit](https://img.shields.io/github/last-commit/weedzinxd/pi-from-hungry)
![Open Issues](https://img.shields.io/github/issues/weedzinxd/pi-from-hungry)
![Forks](https://img.shields.io/github/forks/weedzinxd/pi-from-hungry?style=social)

---

> **⚠️ AVISO LEGAL**: Este é um projeto de código aberto em desenvolvimento ativo. Ainda NÃO está em produção. Contratos inteligentes NÃO foram auditados. NÃO envie Pi real para nenhum endereço relacionado a este projeto.

---

## 🎯 Visão Geral

**Pi From Hungry** é um sistema autônomo de detecção e combate à fome em tempo real, utilizando:

| Tecnologia | Propósito |
|------------|-----------|
| 🛰️ **Dados Satelitais** | NASA MODIS/VIIRS, Sentinel-2, Landsat 9 |
| 🤖 **Inteligência Artificial** | TensorFlow/PyTorch - Detecção preditiva |
| ⛓️ **Pi Network Blockchain** | Smart Contracts Soroban - Transparência total |
| 🚁 **Drones IoT** | Entrega autônoma em áreas remotas |

### ✨ O que este projeto faz:

1. **Detecta** focos de fome usando imagens de satélite e IA
2. **Registra** alertas on-chain na Pi Network
3. **Coordena** distribuição de ajuda via parceiros
4. **Transparencia** 100% das transações em tempo real

> **Missão:** Nenhum ser humano deve passar fome.

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      SATÉLITES (NASA/ESA)                       │
│            NDVI, Imagens multiespectrais, Luz noturna           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND IA (Python)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Detector de  │  │  FomeScore   │  │   Otimizador de      │  │
│  │  Hotspots    │  │  Predictor   │  │      Rotas           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN (Pi Network)                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ HungerReliefAgent│  │PioneerReputation │  │ ImpactLedger │  │
│  │   (Soroban)      │  │   (NFT Badges)   │  │  (Auditoria) │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DASHBOARD (Frontend)                        │
│     Mapa de calor • Gráficos de impacto • Provas on-chain      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📂 Estrutura do Projeto

```
pi-from-hungry/
├── 📁 src/                        # SDK TypeScript
│   ├── pi-rpc.ts                 # Cliente RPC Pi Testnet
│   ├── pi-network.ts             # Abstração de alto nível
│   ├── client.ts                 # CLI de comandos
│   └── scanner.ts                # Monitor de eventos
│
├── 📁 contracts/                  # Smart Contracts
│   ├── Cargo.toml                # Projeto Rust/Soroban
│   ├── src/lib.rs                # Contrato canônico Soroban/Stellar-style
│   ├── HungerReliefAgent.rs      # Ponteiro legado de compatibilidade
│   └── HungerReliefAgent.sol     # Protótipo legado EVM, não canônico
│
├── 📁 backend-ia/                 # Backend Python (IA/ML)
│   ├── detector-fome.py          # Detector de hotspots
│   ├── integrar-blockchain.py    # Integração com Pi
│   └── *.json                    # Dados de saída
│
├── 📁 apps/api/                   # API FastAPI da demo pública
├── 📁 dashboard/                  # Frontend Next.js público
│   ├── app/                      # Rotas públicas + dashboard
│   └── package.json
│
├── 📁 services/indexer/           # Indexador simples de eventos
├── 📁 services/ml-pipeline/       # Pipeline de hotspots com enriquecimento climático
├── 📁 data/                       # Hotspots demo + curated + snapshot de eventos
├── 📁 scripts/                    # Deploy e utilitários Soroban
├── 📁 legacy/evm/                 # Trilha EVM/Hardhat preservada como legado
├── 📁 artifacts/                  # Artefatos legados
├── 📁 deployments/                # Endereços de contratos
└── 📁 cache/                      # Dados em cache
```

---

## 🚀 Começando

### Pré-requisitos

| Software | Versão Mínima |
|----------|---------------|
| Node.js | 18+ |
| Python | 3.10+ |
| npm/yarn | Latest |
| Git | 2.0+ |

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/weedzinxd/pi-from-hungry.git
cd pi-from-hungry

# 2. Instale dependências Node.js
npm install

# 3. Instale dependências Python da API/demo de dados
python3 -m venv .venv
source .venv/bin/activate
pip install -r apps/api/requirements.txt
pip install numpy pandas scikit-learn

# 4. Configure variáveis de ambiente
cp .env.example .env
```

### Uso Rápido

```bash
# Subir API FastAPI da demo pública
npm run api:dev

# Em outro terminal, subir o dashboard
npm run dashboard:dev

# Verificar conexão com Pi Testnet
npx tsx src/client.ts ping

# Status da rede
npx tsx src/client.ts status

# Executar detector de fome (Python)
python backend-ia/detector-fome.py

# Monitorar contratos em tempo real
npx tsx src/scanner.ts --monitor

# Gerar hotspots curados com pipeline + clima quase em tempo real
npm run pi:pipeline:build

# Atualizar detector + pipeline em sequência
npm run pi:pipeline:refresh

# Indexar eventos do contrato em snapshot local
npm run indexer:events

# Abrir páginas públicas da demo
# /
# /dashboard
# /hotspots
# /analytics
# /comparison
# /pi-app (shell mobile para Pi App Studio / Pi Browser)
# /pi-app/impact (área dedicada de impacto do pioneiro)
# /dashboard (agora com movers + analytics summary)
# endpoints Pi mini-app: /pi-auth/verify, /pi-payments/intents, /pi-payments/intents/{id}/approve, /pi-payments/intents/{id}/complete, /pi-payments/my-impact, /pi-payments/overview, /pi-payments/feed
# donations e dashboard agora incluem visão agregada do mini-app Pi
# /donations
# /methodology
# /proofs
# /status
# /methodology
# /launch
# /transparency
# hotspot details com trend panel em /hotspots/[id]
# setup do mini-app Pi App Studio em docs/PI_APP_STUDIO_SETUP.md
# auth/payment demo do mini-app com intents persistidas em data/pi-payment-intents.json
```

---

## 🔗 Pi Network Testnet

### Endpoint RPC

```
https://rpc.testnet.minepi.com
```

### Status da Rede

| Parâmetro | Valor |
|-----------|-------|
| Status | ✅ Healthy |
| Protocolo | Soroban v23 |
| Ledger Atual | ~23.98M |
| Taxa | 100000 stroops |
| Retenção | 120960 ledgers |

### Métodos RPC Disponíveis

| Método | Descrição | Exemplo |
|--------|-----------|---------|
| `getHealth` | Status do nó | Verifica conectividade |
| `getNetwork` | Info da rede | Passphrase, versão |
| `getLatestLedger` | Último ledger | Número e timestamp |
| `getFeeStats` | Taxas | Estatísticas de gas |
| `getEvents` | Eventos | Histórico de contratos |
| `getTransactions` | Transações | Por ledger ou hash |

---

## 📊 Contrato Principal

### HungerReliefAgent

**Contract ID (Testnet):**
```
CDG6ZM2SHXIHD5HZ2E62B7D76RY5DUHDNQVPSHRVDNN7W4EW47FXLEXQ
```

### Funções do Contrato

| Função | Descrição |
|--------|-----------|
| `register_hotspot(caller, location_hash, severity, confidence_bps, estimated_cost_stroops, evidence_hash)` | Registra novo foco com evidência e confiança |
| `donate(donor, hotspot_id, amount_stroops, memo_hash)` | Registra doação declarada e unidades de impacto |
| `distribute_aid(caller, hotspot_id, amount_stroops, proof_hash)` | Registra distribuição auditável |
| `get_hotspot_summary(id)` | Retorna resumo financeiro e operacional do hotspot |

---

## 🤖 Backend IA (Python)

### Detector de Fome

O detector analisa múltiplas fontes de dados:

```
• NASA MODIS NDVI        → Índice de vegetação
• Precipitação           → Dados históricos
• Preços de alimentos    → Estabilidade econômica
• Conflitos armados      → Zonas de risco
• Migração               → Movimentos populacionais
```

### Output do Detector

```json
{
  "hotspots": [
    {
      "id": "sahel-2026-001",
      "location": "Sahel, África",
      "coordinates": [15.0, 20.0],
      "fome_score": 0.876,
      "severity": "CRÍTICO",
      "population_affected": 2800000,
      "timestamp": "2026-04-01T12:00:00Z"
    }
  ]
}
```

---

## 🛠️ Stack Tecnológica

### Backend

| Camada | Tecnologia |
|--------|------------|
| Smart Contracts | Rust + Soroban |
| IA/ML | Python 3.12+, TensorFlow |
| API | FastAPI |
| Indexação | TypeScript + Pi RPC |
| Blockchain | Stellar/Soroban RPC + integração Pi |

### Frontend

| Camada | Tecnologia |
|--------|------------|
| Web | Next.js 14+, TypeScript |
| Estilização | TailwindCSS |
| Web3 | Wagmi, Viem |
| Maps | deck.gl, Mapbox |

### Infraestrutura

| Camada | Tecnologia |
|--------|------------|
| Cloud | AWS/GCP/Azure |
| Orquestração | Kubernetes, Docker |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus, Grafana |

---

## 📈 Roadmap

```
[FASE 1] MVP - Q2 2026
├── ✅ Conexão RPC Pi Testnet
├── ✅ Detector de Fome Python
├── ✅ Smart Contract básico
├── 🔄 Dashboard web
└── 🔄 1 região piloto

[FASE 2] Escala - Q4 2026
├── 🔜 Múltiplas fontes de dados
├── 🔜 Modelos IA preditivos
├── 🔜 App mobile
└── 🔜 5 regiões cobertas

[FASE 3] Autonomia - 2027
├── 🔜 Drones autônomos
├── 🔜 Rede IoT LoRaWAN
├── 🔜 DAO de governança
└── 🔜 50+ regiões

[FASE 4] Global - 2028+
├── 🔜 Parcerias governamentais
├── 🔜 Integração bancária
└── 🔜 Cobertura global
```

---

## 🏆 Certificações e Reconhecimentos

<!-- badges-placeholder -->

| Certificação | Status | Data |
|--------------|--------|------|
| MIT License | ✅ Concedida | 2026 |
| Pi Network Developer | 🔜 Em progresso | - |
| Smart Contract Audit | 🔜 Pendente | - |

---

## 🤝 Como Contribuir

Leia nosso [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes.

### Formas de Contribuir

- 🐛 Reportar bugs
- 💡 Sugerir features
- 📝 Melhorar documentação
- 🔧 Code reviews
- 🌐 Traduções
- 💰 Patrocínio

### Processo

```
1. Fork → 2. Branch → 3. Commit → 4. Push → 5. PR → 6. Review → 7. Merge
```

---

## 📖 Documentação

| Documento | Descrição |
|-----------|-----------|
| [DOCUMENT.md](./DOCUMENT.md) | Especificação técnica completa |
| [docs/ARQUITETURA_SOROBAN.md](./docs/ARQUITETURA_SOROBAN.md) | Arquitetura canônica Soroban |
| [docs/SETUP_RUST_SOROBAN.md](./docs/SETUP_RUST_SOROBAN.md) | Setup local Rust/Soroban |
| [docs/SOROBAN_WORKFLOW.md](./docs/SOROBAN_WORKFLOW.md) | Workflow prático de deploy/invoke |
| [docs/TECHNICAL_AUDIT_2026-04-02.md](./docs/TECHNICAL_AUDIT_2026-04-02.md) | Auditoria técnica inicial |
| [docs/ROADMAP_TECNICO.md](./docs/ROADMAP_TECNICO.md) | Roadmap técnico |
| [services/indexer/README.md](./services/indexer/README.md) | Indexador simples de eventos |
| [services/ml-pipeline/README.md](./services/ml-pipeline/README.md) | Pipeline v1 de hotspots curados |
| [docs/DEPLOY_PUBLIC_DEMO.md](./docs/DEPLOY_PUBLIC_DEMO.md) | Guia de deploy público |
| [docs/TESTNET_REAL_CONTRACT_SETUP.md](./docs/TESTNET_REAL_CONTRACT_SETUP.md) | Setup para contrato real em testnet |
| [docs/PUBLIC_LAUNCH_CHECKLIST.md](./docs/PUBLIC_LAUNCH_CHECKLIST.md) | Checklist de lançamento público |
| [docs/VERCEL_RENDER_DEPLOY_STEPS.md](./docs/VERCEL_RENDER_DEPLOY_STEPS.md) | Passo a passo Vercel + Render |
| [docs/ENVIRONMENT_REFERENCE.md](./docs/ENVIRONMENT_REFERENCE.md) | Referência de variáveis de ambiente |
| [docs/SHOWCASE_SCRIPT.md](./docs/SHOWCASE_SCRIPT.md) | Roteiro de apresentação pública |
| [docs/METHODOLOGY_V1.md](./docs/METHODOLOGY_V1.md) | Metodologia atual do pipeline v1/v2 |
| [docs/FINAL_DEPLOY_RUNBOOK.md](./docs/FINAL_DEPLOY_RUNBOOK.md) | Runbook final de deploy |
| [docs/PUBLISH_MESSAGE_TEMPLATES.md](./docs/PUBLISH_MESSAGE_TEMPLATES.md) | Modelos de mensagem para divulgação |
| [legacy/evm/README.md](./legacy/evm/README.md) | Contexto do legado EVM/Hardhat |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Guia de contribuição |
| [dashboard/AGENTS.md](./dashboard/AGENTS.md) | Documentação do dashboard |

---

## 📞 Contato

| Canal | Link |
|-------|------|
| GitHub Issues | [Abrir Issue](https://github.com/weedzinxd/pi-from-hungry/issues) |
| Discussions | [GitHub Discussions](https://github.com/weedzinxd/pi-from-hungry/discussions) |

### Equipe

- **Fundador**: [@WeedzinxD](https://github.com/weedzinxd) - Pi Pioneer desde 2019

---

## ⚖️ Licença

| Tipo | Licença |
|------|---------|
| Código | MIT License |
| Documentação | CC-BY-SA 4.0 |
| Marca | CC-BY-NC |

Consulte [LICENSE](./LICENSE) para detalhes.

---

## 🙏 Acknowledgments

Agradecimentos especiais a:

- **Pi Network Core Team** - pela plataforma revolucionária
- **Stellar Development Foundation** - pela tecnologia Soroban
- **NASA EOSDIS** - pelos dados satelitais abertos
- **Open Source Community** - pelas ferramentas gratuitas

---

## ⚠️ Disclaimer

> **IMPORTANTE**: Este projeto é software experimental em desenvolvimento. 
> 
> - ⚠️ NÃO é produto final
> - ⚠️ NÃO está auditado
> - ⚠️ NÃO use em produção
> - ⚠️ Contratos NÃO foram auditados por firmas de segurança
> 
> O autor NÃO se responsabiliza por perdas financeiras.
> Use apenas na Testnet com Pi de teste.

---

## ⭐ Se este projeto te ajuda, deixe uma estrela!

[![Star](https://img.shields.io/github/stars/weedzinxd/pi-from-hungry?style=social)](https://github.com/weedzinxd/pi-from-hungry/stargazers)

---

> *"Tecnologia sem propósito é só código.*
> *Propósito sem ação é só sonho.*
> *Pi From Hungry une os dois."*
> 
> **— @WeedzinxD**

---

**Versão:** 1.0.0  
**Última Atualização:** 1 de Abril de 2026  
** SPDX-License-Identifier: MIT**
