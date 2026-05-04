# Contract Events Indexer

Indexador simples para a demo pública. Ele consulta eventos do contrato no Pi RPC e persiste um snapshot local em `data/indexed-events.json`.

## Uso

```bash
npm run indexer:events
```

Opcionalmente, informe ledger inicial e limite:

```bash
npm run indexer:events -- 23980000 100
```

> Observação: o ledger inicial precisa estar dentro da janela de retenção do RPC. O script ajusta automaticamente para o ledger mais antigo disponível quando necessário.

## Variáveis úteis
- `CONTRACT_ID`
- `PI_RPC_URL`
- `SOROBAN_RPC_URL`
- `INDEXER_OUTPUT_FILE`
