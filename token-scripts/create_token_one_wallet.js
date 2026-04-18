/**
 * 🍽️ HUNGER TOKEN CREATOR - Pi From Hungry
 * 
 * Creates the HUNGER humanitarian token on Pi Testnet
 * Uses ONE wallet for both Issuer and Distributor
 * 
 * RUN: export YOUR_SECRET="your-wallet-secret" && node create_token_one_wallet.js
 */

const StellarSDK = require("@stellar/stellar-sdk");

// Pi Testnet
const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
const NETWORK_PASSPHRASE = "Pi Testnet";

// Token Config
const TOKEN_CODE = "HUNGER";
const TOKEN_NAME = "Pi From Hungry Humanitarian Token";
const TOTAL_SUPPLY = "1000000000"; // 1 billion

async function createToken() {
    console.log("\n" + "═".repeat(60));
    console.log("🍽️  PI FROM HUNGRY - HUNGER TOKEN CREATOR");
    console.log("═".repeat(60) + "\n");

    // Get secret from env
    const YOUR_SECRET = process.env.YOUR_SECRET;
    
    if (!YOUR_SECRET) {
        console.log("❌ ERROR: Set YOUR_SECRET first");
        console.log("\nRun:");
        console.log('export YOUR_SECRET="SXXXXXXXX..."');
        console.log("\nGet secret: Pi Wallet > Settings > View Secret Key");
        process.exit(1);
    }

    const keypair = StellarSDK.Keypair.fromSecret(YOUR_SECRET);
    const walletAddress = keypair.publicKey();

    console.log("📝 Wallet:", walletAddress);
    console.log("");

    try {
        // Load account
        console.log("⏳ Loading account from blockchain...");
        const account = await server.loadAccount(walletAddress);
        
        const piBalance = account.balances.find(b => b.asset_type === "native")?.balance || "0";
        console.log("💰 PI Balance:", piBalance);
        
        if (parseFloat(piBalance) < 5) {
            console.log("⚠️  WARNING: Low balance! Need ~5 PI for fees");
        }
        console.log("");

        // Get base fee
        const ledger = await server.ledgers().order("desc").limit(1).call();
        const baseFee = parseInt(ledger.records[0].base_fee_in_stroops);
        console.log("📊 Network fee:", baseFee, "stroops");

        // Create token asset (issued by YOUR wallet)
        const token = new StellarSDK.Asset(TOKEN_CODE, walletAddress);

        // ========================================
        // STEP 1: Create Trustline
        // ========================================
        console.log("\n📋 STEP 1: Creating Trustline...");
        console.log("-".repeat(40));
        
        const trustTx = new StellarSDK.TransactionBuilder(account, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.changeTrust({
            asset: token,
            limit: TOTAL_SUPPLY
        }))
        .build();

        trustTx.sign(keypair);
        
        const trustResult = await server.submitTransaction(trustTx);
        console.log("✅ Trustline created!");
        console.log("   TX:", trustResult.hash);

        // Reload account for next transaction
        const account2 = await server.loadAccount(walletAddress);

        // ========================================
        // STEP 2: Mint 1 Billion HUNGER
        // ========================================
        console.log("\n📋 STEP 2: Minting 1 Billion HUNGER...");
        console.log("-".repeat(40));
        
        const mintTx = new StellarSDK.TransactionBuilder(account2, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.payment({
            destination: walletAddress,
            asset: token,
            amount: TOTAL_SUPPLY
        }))
        .build();

        mintTx.sign(keypair);
        
        const mintResult = await server.submitTransaction(mintTx);
        console.log("✅ 1,000,000,000 HUNGER minted!");
        console.log("   TX:", mintResult.hash);

        // Reload for final check
        const account3 = await server.loadAccount(walletAddress);

        // ========================================
        // STEP 3: Set Home Domain
        // ========================================
        console.log("\n📋 STEP 3: Setting Home Domain...");
        console.log("-".repeat(40));
        
        const homeTx = new StellarSDK.TransactionBuilder(account3, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.setOptions({
            homeDomain: "pi-from-hungry.github.io"
        }))
        .build();

        homeTx.sign(keypair);
        
        const homeResult = await server.submitTransaction(homeTx);
        console.log("✅ Home Domain set!");
        console.log("   TX:", homeResult.hash);

        // ========================================
        // STEP 4: Verify
        // ========================================
        console.log("\n📋 VERIFICATION...");
        console.log("-".repeat(40));
        
        const finalAccount = await server.loadAccount(walletAddress);
        
        console.log("\n💰 Final Balances:");
        finalAccount.balances.forEach(b => {
            if (b.asset_type === "native") {
                console.log("   PI:", b.balance);
            } else {
                console.log(`   ${b.asset_code}:`, b.balance);
            }
        });

        // ========================================
        // SUCCESS!
        // ========================================
        console.log("\n" + "═".repeat(60));
        console.log("🎉 HUNGER TOKEN CREATED SUCCESSFULLY!");
        console.log("═".repeat(60));
        console.log("");
        console.log("📊 TOKEN DETAILS:");
        console.log("   Name:       Pi From Hungry Humanitarian Token");
        console.log("   Code:       HUNGER");
        console.log("   Supply:     1,000,000,000");
        console.log("   Issuer:    ", walletAddress);
        console.log("");
        console.log("📋 NEXT STEPS:");
        console.log("   1. Host pi.toml file (instructions below)");
        console.log("   2. Create Liquidity Pool in Pi Wallet");
        console.log("   3. Start swapping!");
        console.log("");
        console.log("🌐 pi.toml URL needed:");
        console.log("   https://pi-from-hungry.github.io/.well-known/pi.toml");
        console.log("");
        console.log("💝 Together, we can end hunger!");
        console.log("=".repeat(60) + "\n");

    } catch (error) {
        console.error("\n❌ ERROR:", error.message);
        if (error.response?.data?.extras?.result_codes) {
            console.error("Result codes:", error.response.data.extras.result_codes);
        }
        process.exit(1);
    }
}

createToken();
