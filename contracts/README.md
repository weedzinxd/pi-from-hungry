# HungerReliefAgent Soroban Contract

Este diretório agora contém um projeto Rust/Soroban compilável.

## Estrutura

- `Cargo.toml` — manifesto do contrato
- `src/lib.rs` — contrato canônico
- `.cargo/config.toml` — target WASM padrão
- `../HungerReliefAgent.rs` — ponteiro legado para compatibilidade documental

## Pré-requisitos

Instale Rust e o target WASM:

```bash
rustup default stable
rustup target add wasm32-unknown-unknown
```

Instale também o CLI Soroban/Stellar conforme sua stack operacional.

## Comandos esperados

### Testes locais
```bash
cd contracts
cargo test
```

### Build WASM
```bash
cd contracts
cargo build --target wasm32-unknown-unknown --release
```

Artefato esperado:

```bash
contracts/target/wasm32-unknown-unknown/release/hunger_relief_agent.wasm
```

## Próximos passos

1. validar a versão exata do `soroban-sdk` compatível com sua rede alvo;
2. compilar localmente;
3. otimizar o WASM;
4. integrar deploy e invoke reais.

## Observação

Neste ambiente atual o toolchain Rust não está instalado, então a estrutura foi preparada, mas a compilação precisa ser executada em uma máquina com `rustc` e `cargo` disponíveis.
