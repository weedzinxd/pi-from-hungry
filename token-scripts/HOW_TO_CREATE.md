# 🍽️ CRIAR TOKEN HUNGER - PASSO A PASSO

## O QUE PRECISA FAZER:

### 1. Obter sua Wallet Secret

1. Abra o **Pi Wallet** no celular
2. Vá em **Settings** (Configurações)
3. Clique em **View Secret Key** (Ver Chave Secreta)
4. **Copie a chave** (começa com 'S')
5. **NÃO COMPARTILHE COM NINGUÉM!**

### 2. Rodar o Script

No terminal, execute:

```bash
cd /home/weed/pi-from-hungry/token-scripts

export YOUR_SECRET="AQUI_SUA_CHAVE_SECRETA"

npm run create-token
```

### 3. O que vai acontecer:

1. ✅ Criar trustline para o token HUNGER
2. ✅ Mintar 1 BILHÃO de tokens HUNGER
3. ✅ Configurar Home Domain
4. ✅ Mostrar confirmação

### 4. Depois (opcional):

Criar Liquidity Pool no Pi Wallet:
1. Pi Wallet > Tokens
2. Liquidity Pools
3. Criar nova pool
4. Selecionar: HUNGER / PI
5. Adicionar seus 500 PI

---

## TOKEN CRIADO:

- **Nome**: Pi From Hungry
- **Código**: HUNGER
- **Supply**: 1,000,000,000
- **Issuer**: `GAORA7V3H4RWZARFWUJANNDL4HT5S2FFNNQU7TEFF4FOSYTDE6B6HTLW`

---

## PROBLEMAS?

Se der erro:
- "Insufficient balance" → Você precisa de mais PI para taxas
- "Invalid secret" → Verifique se copiou a chave correta
- "Trustline exists" → Já criou antes, pode pular

---

**Cole sua secret aqui para eu te ajudar!**
