/**
 * 🍽️ PI FROM HUNGRY - HUNGER TOKEN MINIMAL CREATOR
 * 
 * Creates the HUNGER token with your existing 2,670 PI
 * Pool: 10M HUNGER + 500 PI = plenty for testing!
 */

const StellarSDK = require("@stellar/stellar-sdk");
const fs = require("fs");

// Pi Testnet Configuration
const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
const NETWORK_PASSPHRASE = "Pi Testnet";

// ============================================
// YOUR WALLET - JUST ONE WALLET FOR NOW
// ============================================
const YOUR_SECRET = process.env.YOUR_SECRET || "";
const TOKEN_CODE = "HUNGER";
const TOKEN_ISSUER = "GAORA7V3H4RWZARFWUJANNDL4HT5S2FFNNQU7TEFF4FOSYTDE6B6HTLW";

async function createToken() {
    console.log("╔════════════════════════════════════════════════════════╗");
    console.log("║                                                        ║");
    console.log("║   🍽️  HUNGER TOKEN - CREATING ON PI TESTNET       ║");
    console.log("║                                                        ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log("");

    // Validate
    if (!YOUR_SECRET) {
        console.log("❌ ERROR: Please set YOUR_SECRET");
        console.log("");
        console.log("Run:");
        console.log('export YOUR_SECRET="your-wallet-secret"');
        console.log("");
        console.log("Get your secret from: Pi Wallet > Settings > View Secret Key");
        process.exit(1);
    }

    const keypair = StellarSDK.Keypair.fromSecret(YOUR_SECRET);
    console.log(`📝 Wallet: ${keypair.publicKey()}`);
    console.log("");

    try {
        // Load account
        console.log("📋 Loading account...");
        const account = await server.loadAccount(keypair.publicKey());
        
        // Check balance
        const piBalance = account.balances.find(b => b.asset_type === "native");
        console.log(`💰 Balance: ${piBalance?.balance || 0} PI`);
        console.log("");

        if (parseFloat(piBalance?.balance || 0) < 10) {
            console.log("⚠️  WARNING: Low balance. You need some PI for fees.");
            console.log("   But we'll try anyway...");
        }

        // Get base fee
        const ledger = await server.ledgers().order("desc").limit(1).call();
        const baseFee = ledger.records[0].base_fee_in_stroops;

        // Create token asset
        const customToken = new StellarSDK.Asset(TOKEN_CODE, TOKEN_ISSUER);

        // ==========================================
        // STEP 1: Create Trustline
        // ==========================================
        console.log("📋 STEP 1: Creating Trustline for HUNGER...");
        
        const trustTx = new StellarSDK.TransactionBuilder(account, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.changeTrust({
            asset: customToken,
            limit: "1000000000"
        }))
        .build();

        trustTx.sign(keypair);
        
        console.log("⏳ Submitting trustline...");
        const trustResult = await server.submitTransaction(trustTx);
        console.log(`✅ Trustline created!`);
        console.log(`   TX: ${trustResult.hash}`);
        console.log("");

        // ==========================================
        // STEP 2: Mint 1 Billion HUNGER
        // ==========================================
        console.log("📋 STEP 2: Minting 1 Billion HUNGER tokens...");
        
        const issuerAccount = await server.loadAccount(TOKEN_ISSUER);
        
        const mintTx = new StellarSDK.TransactionBuilder(issuerAccount, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.payment({
            destination: keypair.publicKey(),
            asset: customToken,
            amount: "1000000000"
        }))
        .build();

        // We can't sign with issuer unless we have the secret
        // So let's check if trustline worked first
        console.log("");
        console.log("⚠️  NOTE: To mint tokens, we need the ISSUER secret.");
        console.log("   The token is registered on-chain, but minting needs issuer.");
        console.log("");
        
        // Check current balances
        console.log("📋 Current Balances:");
        const updatedAccount = await server.loadAccount(keypair.publicKey());
        updatedAccount.balances.forEach(b => {
            if (b.asset_type === "native") {
                console.log(`   PI: ${b.balance}`);
            } else {
                console.log(`   ${b.asset_code}: ${b.balance}`);
            }
        });
        console.log("");

        console.log("════════════════════════════════════════════════════════");
        console.log("🎉 TRUSTLINE CREATED SUCCESSFULLY!");
        console.log("════════════════════════════════════════════════════════");
        console.log("");
        console.log("📊 SUMMARY:");
        console.log(`   Token Code:      ${TOKEN_CODE}`);
        console.log(`   Issuer:          ${TOKEN_ISSUER}`);
        console.log(`   Your Wallet:     ${keypair.publicKey()}`);
        console.log("");
        console.log("📋 NEXT STEPS:");
        console.log("   1. Get ISSUER secret (ask the team)");
        console.log("   2. Run mint script to create tokens");
        console.log("   3. Create liquidity pool in Pi Wallet");
        console.log("");
        console.log("💝 Together, we can end hunger!");
        console.log("════════════════════════════════════════════════════════");

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        if (error.response?.data) {
            console.error("Details:", JSON.stringify(error.response.data, null, 2));
        }
        process.exit(1);
    }
}

createToken();
