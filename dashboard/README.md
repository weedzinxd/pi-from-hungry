# 🌍 Pi From Hungry - Dashboard

> Dashboard em tempo real para monitoramento de hotspots de fome e impacto social.

## 📋 Visão Geral

O **Pi From Hungry Dashboard** é o frontend web do sistema, oferecendo:

| Feature | Descrição |
|---------|-----------|
| 🗺️ **Mapa de Calor** | Visualização geoespacial de hotspots em tempo real |
| 📊 **Gráficos de Impacto** | Doações, distribuições, vidas impactadas |
| 🔗 **Explorador On-Chain** | Transações e eventos do contrato inteligente |
| 📱 **Responsivo** | Funciona em desktop, tablet e mobile |

---

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

```bash
# A partir da raiz do projeto
cd dashboard

# Instale dependências
npm install

# Copie variáveis de ambiente
cp .env.example .env.local
```

### Variáveis de Ambiente

```env
# Pi Network RPC
NEXT_PUBLIC_PI_RPC_URL=https://rpc.testnet.minepi.com

# IPFS Gateway (provas de distribuição)
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/

# API de dados (futuro)
NEXT_PUBLIC_API_URL=https://api.pi-from-hungry.org
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# O dashboard estará disponível em:
# http://localhost:3000
```

### Build de Produção

```bash
# Build otimizado
npm run build

# Preview do build
npm run start
```

---

## 🎨 Stack Tecnológica

| Tecnologia | Uso |
|------------|-----|
| **Next.js 14+** | Framework React |
| **TypeScript** | Type safety |
| **TailwindCSS** | Estilização |
| **shadcn/ui** | Componentes |
| **deck.gl** | Visualização geoespacial |
| **Recharts** | Gráficos |
| **Wagmi + Viem** | Integração Web3 |
| **Socket.io** | Tempo real |

---

## 📁 Estrutura

> Veja também [ENTERPRISE_PLAN.md](./ENTERPRISE_PLAN.md) para a evolução arquitetural do dashboard.

```
dashboard/
├── 📁 app/                    # Next.js App Router
│   ├── page.tsx              # Página principal
│   ├── layout.tsx            # Layout global
│   └── globals.css           # Estilos globais
│
├── 📁 components/            # Componentes React
│   ├── Map/                  # Componentes de mapa
│   ├── Charts/               # Gráficos
│   ├── Dashboard/            # Layout do dashboard
│   └── ui/                   # shadcn/ui components
│
├── 📁 lib/                   # Utilitários
│   ├── pi.ts                 # Cliente Pi Network
│   ├── utils.ts              # Funções auxiliares
│   └── constants.ts          # Constantes
│
├── 📁 hooks/                 # React hooks customizados
│   ├── usePiNetwork.ts       # Hook para Pi Network
│   └── useHotspots.ts        # Hook para hotspots
│
└── 📁 types/                 # Definições TypeScript
    └── index.ts              # Tipos globais
```

---

## 🔌 Integração com Backend

### Pi Network RPC

```typescript
// lib/pi.ts
import { PiNetworkClient } from '@/lib/pi';

export async function fetchHotspots() {
  const client = new PiNetworkClient();
  const events = await client.getEvents({
    contract: process.env.NEXT_PUBLIC_CONTRACT_ID,
    type: 'hotspot_registered'
  });
  return events;
}
```

### Socket.io (Tempo Real)

```typescript
// hooks/useSocket.ts
import { io } from 'socket.io-client';

export function useHotspots() {
  const socket = io(process.env.NEXT_PUBLIC_API_URL!);
  
  useEffect(() => {
    socket.on('hotspot:new', (hotspot) => {
      // Atualizar estado
    });
    
    return () => socket.disconnect();
  }, []);
}
```

---

## 🧪 Testes

```bash
# Executar testes
npm run test

# Testes com coverage
npm run test:coverage

# Modo watch
npm run test:watch
```

---

## 📦 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Iniciar servidor de produção |
| `npm run lint` | Verificar código |
| `npm run test` | Executar testes |
| `npm run format` | Formatar código |

---

## 🤝 Contribuição

1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/minha-feature`
3. Commit: `git commit -m "feat(dashboard): adiciona nova feature"`
4. Push: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## 📖 Documentação Adicional

| Documento | Descrição |
|-----------|-----------|
| [AGENTS.md](./AGENTS.md) | Documentação dos agentes IA |
| [DOCUMENT.md](../DOCUMENT.md) | Especificação técnica completa |
| [CONTRIBUTING.md](../CONTRIBUTING.md) | Guia de contribuição |

---

## ⚖️ Licença

MIT License - consulte [LICENSE](../LICENSE) para detalhes.

---

## 🙏 Créditos

- [Pi Network](https://minepi.com) - Plataforma blockchain
- [Next.js](https://nextjs.org) - Framework
- [deck.gl](https://deck.gl) - Visualização geoespacial
- [shadcn/ui](https://ui.shadcn.com) - Componentes

---

> *"Nenhum ser humano deve passar fome."*

**© 2026 Pi From Hungry**
