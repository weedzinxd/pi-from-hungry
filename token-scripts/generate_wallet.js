/**
 * 🔐 NEW WALLET GENERATOR - Pi From Hungry
 * 
 * Cria uma NOVA wallet para o projeto (NÃO USA SUA WALLET PRINCIPAL!)
 * Esta wallet é apenas para development/testnet
 * 
 * Execute: node generate_wallet.js
 */

const StellarSDK = require("@stellar/stellar-sdk");

async function generateWallet() {
    console.log("\n" + "═".repeat(60));
    console.log("🔐 PI FROM HUNGRY - NEW WALLET GENERATOR");
    console.log("═".repeat(60));
    console.log("\n⚠️  IMPORTANT: Esta wallet é para TESTNET apenas!");
    console.log("   NÃO tem valor real!");
    console.log("");

    // Generate new keypair
    const keypair = StellarSDK.Keypair.random();
    
    console.log("✅ NOVA WALLET GERADA!");
    console.log("\n" + "-".repeat(60));
    console.log("📝 PUBLIC KEY (para receber PI):");
    console.log("-".repeat(60));
    console.log(keypair.publicKey());
    console.log("");
    
    console.log("🔐 SECRET KEY (GUARDE EM LOCAL SEGURO!):");
    console.log("-".repeat(60));
    console.log(keypair.secret());
    console.log("");
    
    console.log("⚠️  ⚠️  ⚠️  ATENÇÃO ⚠️  ⚠️  ⚠️");
    console.log("-".repeat(60));
    console.log("1. COPIE e SALVE a Secret Key agora!");
    console.log("2. NUNCA compartilhe com ninguém!");
    console.log("3. Esta chave dá acesso à wallet!");
    console.log("4. Guarde em: arquivo seguro, gerenciador de senhas, etc.");
    console.log("");

    // Save to file
    const fs = require('fs');
    const walletInfo = `
# PI FROM HUNGRY - WALLET INFO
# Gerado em: ${new Date().toISOString()}
# Rede: Pi Testnet

PUBLIC_KEY=${keypair.publicKey()}
SECRET_KEY=${keypair.secret()}

⚠️  MANTENHA ESTE ARQUIVO SEGURO!
`;

    fs.writeFileSync('NEW_WALLET_INFO.txt', walletInfo);
    console.log("💾 Info salva em: NEW_WALLET_INFO.txt");

    console.log("\n" + "═".repeat(60));
    console.log("📋 PRÓXIMOS PASSOS:");
    console.log("═".repeat(60));
    console.log("");
    console.log("1. Salve a Secret Key em lugar seguro");
    console.log("");
    console.log("2. Copie a PUBLIC KEY e peça PI da faucet:");
    console.log(`   ${keypair.publicKey()}`);
    console.log("");
    console.log("3. Use a Secret Key para criar o token HUNGER:");
    console.log('   export YOUR_SECRET="' + keypair.secret() + '"');
    console.log('   npm run create-token');
    console.log("");
    console.log("═".repeat(60) + "\n");

    return {
        publicKey: keypair.publicKey(),
        secret: keypair.secret()
    };
}

generateWallet().catch(console.error);
