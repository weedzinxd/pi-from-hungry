# Pi App Studio Setup

## Objetivo
Publicar uma versão mobile-first do **Pi From Hungry** dentro do ecossistema Pi usando a rota:

- `/pi-app`
- `/pi-app/impact`

Essa rota foi desenhada para funcionar como **preview público** fora do Pi Browser e como **shell de mini-app** quando aberta no ambiente do Pi App Studio.

## O que já foi implementado
- tela mobile-first dedicada em `dashboard/src/app/pi-app/page.tsx`
- carregamento do Pi SDK via `https://sdk.minepi.com/pi-sdk.js`
- inicialização com `version: '2.0'`
- autenticação básica via `Pi.authenticate(['username', 'payments'])`
- endpoint demo de verificação: `POST /pi-auth/verify`
- endpoint demo de intents: `GET/POST /pi-payments/intents`
- ações demo de ciclo de pagamento: `POST /pi-payments/intents/{id}/approve` e `POST /pi-payments/intents/{id}/complete`
- visão do pioneiro: `GET /pi-payments/my-impact?username=...`
- visão agregada: `GET /pi-payments/overview` e `GET /pi-payments/feed`
- badges básicos de impacto (Supporter, Finisher, Impact Builder, Recurring Donor)
- timeline pessoal por pioneiro
- milestones básicos de impacto
- fallback seguro quando o SDK não estiver disponível
- cards de hotspots críticos, proofs, intents, server actions, impacto pessoal, passaporte de impacto, onboarding, milestones e feed agregado

## Variáveis de ambiente
No dashboard:

```env
NEXT_PUBLIC_PI_RPC_URL=https://rpc.testnet.minepi.com
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_CONTRACT_ID=
NEXT_PUBLIC_PI_SANDBOX=true
```

> Use `NEXT_PUBLIC_PI_SANDBOX=true` enquanto a experiência for demonstrativa/testnet.

## URL sugerida para App Studio
Quando o dashboard estiver publicado, use algo como:

```text
https://SEU-DOMINIO/pi-app
```

Exemplo local para preview:

```text
http://localhost:3000/pi-app
```

## Fluxo recomendado de publicação
1. publicar API e dashboard publicamente
2. validar `/pi-app` em mobile
3. cadastrar a URL no Pi App Studio
4. configurar nome, descrição, ícone e categoria
5. testar autenticação no Pi Browser
6. manter o app marcado como demo/testnet até a camada de pagamentos e backend de aprovação estar pronta

## Limitações atuais
- pagamentos Pi ainda **não** foram finalizados no backend
- os endpoints atuais de auth e intents são **demo-safe**, não substituem a verificação oficial do Pi nem o approval/completion real de pagamentos
- autenticação já está preparada no frontend, mas o fluxo de verificação servidor-side ainda precisa ser endurecido
- a experiência atual é ideal para:
  - discovery
  - storytelling
  - transparência
  - prova de conceito

## Próxima evolução sugerida
1. substituir verify demo por verificação oficial server-side do Pi
2. ligar approve/complete aos callbacks reais do Pi Payments
3. registrar doações com vínculo a hotspot e prova/auditoria
4. expandir perfil do pioneiro com histórico e badges de impacto
5. deep links entre mini-app, proofs e hotspots
