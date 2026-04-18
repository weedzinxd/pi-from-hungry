# Setup local — Rust + WASM + Soroban

Este guia prepara a máquina para compilar, testar e futuramente publicar o contrato `contracts/src/lib.rs`.

## 1. Instalar Rust

### Linux / macOS
```bash
curl https://sh.rustup.rs -sSf | sh
source "$HOME/.cargo/env"
rustup default stable
```

### Windows
Instale via `rustup-init.exe`:
- https://rustup.rs/

## 2. Verificar instalação
```bash
rustc --version
cargo --version
rustup --version
```

## 3. Adicionar target WASM
```bash
rustup target add wasm32-unknown-unknown
```

## 4. Ferramentas úteis

### cargo-generate (opcional)
```bash
cargo install cargo-generate
```

### wasm-opt (opcional, para otimização)
No Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y binaryen
```

## 5. Soroban / Stellar CLI

O nome e forma de instalação podem variar conforme a versão da stack usada no momento.
Sugestão operacional:

```bash
stellar --version || true
soroban --version || true
```

Se nenhum existir, instale o CLI oficial compatível com sua rede alvo conforme a documentação Stellar/Soroban vigente.

## 6. Compilar o contrato
```bash
cd contracts
cargo test
cargo build --target wasm32-unknown-unknown --release
```

Artefato esperado:
```bash
contracts/target/wasm32-unknown-unknown/release/hunger_relief_agent.wasm
```

## 7. Otimizar o WASM
Exemplo com CLI Soroban/Stellar, dependendo do binário disponível:

```bash
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/hunger_relief_agent.wasm
```

ou equivalente com `stellar contract optimize`.

## 8. Publicar em testnet
Fluxo esperado:

1. configurar identidade / keypair do operador;
2. apontar para o RPC alvo;
3. deploy do WASM;
4. obter `contractId`;
5. chamar `init(operator, treasury)`.

## 9. Variáveis recomendadas
Crie um `.env` com:

```env
SOROBAN_RPC_URL=https://rpc.testnet.minepi.com
NETWORK_PASSPHRASE=Pi Testnet
CONTRACT_ID=
OPERATOR_ADDRESS=
TREASURY_ADDRESS=
```

## 10. Checklist antes do deploy

- [ ] `cargo test` passa
- [ ] build WASM gerado
- [ ] contrato otimizado
- [ ] endereços do operador e treasury definidos
- [ ] deploy documentado em `deployments/`
- [ ] ABI/spec dos métodos conferida com o cliente TS
