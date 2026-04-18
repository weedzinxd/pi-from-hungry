#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# 🍽️ HUNGER TOKEN CREATOR - Pi From Hungry
# ═══════════════════════════════════════════════════════════════
# 
# Este script cria o token HUNGER na testnet do Pi
#
# USO:
#   1. Edite a linha abaixo e cole sua secret
#   2. Execute: bash create_token.sh
#
# ═══════════════════════════════════════════════════════════════

# ✏️  COLE SUA SECRET AQUI (entre aspas):
YOUR_SECRET="COLE_SUA_SECRET_AQUI"

# Não edite abaixo a menos que saiba o que está fazendo
# ═══════════════════════════════════════════════════════════════

cd /home/weed/pi-from-hungry/token-scripts

echo ""
echo "════════════════════════════════════════════════════════"
echo "🍽️  CRIANDO TOKEN HUNGER..."
echo "════════════════════════════════════════════════════════"
echo ""

if [ "$YOUR_SECRET" = "COLE_SUA_SECRET_AQUI" ]; then
    echo "❌ ERRO: Edite este arquivo e cole sua wallet secret!"
    echo ""
    echo "1. Edite o arquivo:"
    echo "   nano /home/weed/pi-from-hungry/token-scripts/create_token.sh"
    echo ""
    echo "2. Cole sua secret na linha YOUR_SECRET="
    echo ""
    echo "3. Execute novamente:"
    echo "   bash /home/weed/pi-from-hungry/token-scripts/create_token.sh"
    echo ""
    exit 1
fi

export YOUR_SECRET

node create_token_one_wallet.js

echo ""
echo "════════════════════════════════════════════════════════"
echo "🎉 SCRIPT FINALIZADO!"
echo "════════════════════════════════════════════════════════"
