# Dashboard Enterprise Plan

## Meta
Transformar o dashboard atual de página única em uma aplicação observável, modular, segura e pronta para operação contínua.

## Estado atual
- uma página grande em `src/app/page.tsx`
- dados majoritariamente hardcoded
- sem boundary operacional completa
- sem provider central de dados
- sem separação clara de domínio/apresentação

## Melhorias já iniciadas
- `Providers` com React Query
- `loading.tsx`
- `error.tsx`
- `types/domain.ts`
- `lib/config.ts`
- `lib/query-client.ts`
- `hooks/useHotspots.ts`
- `hooks/useNetworkStatus.ts`
- `lib/mock-data.ts`

## Próxima arquitetura recomendada

### App shell
- `app/layout.tsx`
- `app/loading.tsx`
- `app/error.tsx`
- `app/not-found.tsx`

### Domain layer
- `types/domain.ts`
- `lib/config.ts`
- `lib/formatters.ts`
- `lib/constants.ts`

### Data layer
- `hooks/useHotspots.ts`
- `hooks/useNetworkStatus.ts`
- `hooks/useDonations.ts`
- `lib/api/*.ts`

### Presentation layer
- `components/hero/*`
- `components/map/*`
- `components/panels/*`
- `components/charts/*`
- `components/feeds/*`

## Requisitos enterprise
- dados vindos de API/indexador, não hardcoded
- observabilidade de erro
- cache e revalidação
- boundary clara entre mock e produção
- tipagem de domínio única
- feature flags
- testes de smoke e regressão visual
- autenticação para painéis operacionais
- logs de auditoria para ações sensíveis

## Backlog prioritário
1. quebrar `page.tsx` em componentes modulares
2. mover dados mock para a camada `lib/mock-data.ts`
3. introduzir API/indexador como fonte primária
4. criar design system simples e consistente
5. adicionar testes e monitoramento
