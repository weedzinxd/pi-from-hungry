/**
 * HUNGER Token - Liquidity Pool Creator
 * 
 * After creating the HUNGER token, use this script to provide initial liquidity
 * by sending HUNGER tokens to a liquidity wallet.
 */

const StellarSDK = require("@stellar/stellar-sdk");

// Pi Testnet Configuration
const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
const NETWORK_PASSPHRASE = "Pi Testnet";

// Token Configuration
const TOKEN_CODE = "HUNGER";
const ISSUER_PUBLIC_KEY = "GAORA7V3H4RWZARFWUJANNDL4HT5S2FFNNQU7TEFF4FOSYTDE6B6HTLW";

// Wallet Configuration
const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET || "";
const LIQUIDITY_SECRET = process.env.LIQUIDITY_SECRET || "";

// Amounts for Liquidity Pool
const HUNGER_FOR_POOL = "10000000"; // 10M HUNGER tokens for pool
const PI_FOR_POOL = "500"; // 500 PI (user has 2,670 total)

async function setupLiquidity() {
    try {
        console.log("=".repeat(60));
        console.log("🍽️  HUNGER TOKEN - LIQUIDITY POOL SETUP");
        console.log("=".repeat(60));
        console.log("");
        
        // Validate secrets
        if (!DISTRIBUTOR_SECRET || !LIQUIDITY_SECRET) {
            console.log("❌ ERROR: Please set your secrets");
            console.log("");
            console.log("Export your wallet secrets:");
            console.log('export DISTRIBUTOR_SECRET="your-distributor-secret"');
            console.log('export LIQUIDITY_SECRET="your-liquidity-wallet-secret"');
            process.exit(1);
        }

        // Create keypairs
        const distributorKeypair = StellarSDK.Keypair.fromSecret(DISTRIBUTOR_SECRET);
        const liquidityKeypair = StellarSDK.Keypair.fromSecret(LIQUIDITY_SECRET);

        console.log("📝 CONFIGURATION:");
        console.log("-".repeat(40));
        console.log(`Token Code:          ${TOKEN_CODE}`);
        console.log(`Issuer:              ${ISSUER_PUBLIC_KEY}`);
        console.log(`Liquidity Wallet:   ${liquidityKeypair.publicKey()}`);
        console.log(`HUNGER for Pool:    ${HUNGER_FOR_POOL}`);
        console.log(`PI for Pool:        ${PI_FOR_POOL}`);
        console.log("");

        // Create custom token asset
        const customToken = new StellarSDK.Asset(TOKEN_CODE, ISSUER_PUBLIC_KEY);

        // Step 1: Load distributor and create trustline (if not already created)
        console.log("📋 STEP 1: Checking/Creating Trustline...");
        console.log("-".repeat(40));
        
        const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());
        
        // Check if trustline exists
        const hasTrustline = distributorAccount.balances.some(
            b => b.asset_code === TOKEN_CODE
        );
        
        if (!hasTrustline) {
            console.log("Creating trustline for HUNGER token...");
            const response = await server.ledgers().order("desc").limit(1).call();
            const baseFee = response.records[0].base_fee_in_stroops;

            const trustlineTransaction = new StellarSDK.TransactionBuilder(distributorAccount, {
                fee: baseFee,
                networkPassphrase: NETWORK_PASSPHRASE,
                timebounds: await server.fetchTimebounds(90),
            })
            .addOperation(StellarSDK.Operation.changeTrust({
                asset: customToken,
                limit: "1000000000"
            }))
            .build();

            trustlineTransaction.sign(distributorKeypair);
            
            const trustlineResult = await server.submitTransaction(trustlineTransaction);
            console.log(`✅ Trustline created! TX: ${trustlineResult.hash}`);
        } else {
            console.log("✅ Trustline already exists");
        }
        console.log("");

        // Step 2: Create trustline for liquidity wallet
        console.log("📋 STEP 2: Creating Trustline for Liquidity Wallet...");
        console.log("-".repeat(40));
        
        const liquidityAccount = await server.loadAccount(liquidityKeypair.publicKey());
        
        // Check if trustline exists
        const hasLiqTrustline = liquidityAccount.balances.some(
            b => b.asset_code === TOKEN_CODE
        );
        
        if (!hasLiqTrustline) {
            console.log("Creating trustline for liquidity wallet...");
            const response = await server.ledgers().order("desc").limit(1).call();
            const baseFee = response.records[0].base_fee_in_stroops;

            const liqTrustlineTransaction = new StellarSDK.TransactionBuilder(liquidityAccount, {
                fee: baseFee,
                networkPassphrase: NETWORK_PASSPHRASE,
                timebounds: await server.fetchTimebounds(90),
            })
            .addOperation(StellarSDK.Operation.changeTrust({
                asset: customToken,
                limit: HUNGER_FOR_POOL
            }))
            .build();

            liqTrustlineTransaction.sign(liquidityKeypair);
            
            const liqTrustlineResult = await server.submitTransaction(liqTrustlineTransaction);
            console.log(`✅ Liquidity trustline created! TX: ${liqTrustlineResult.hash}`);
        } else {
            console.log("✅ Liquidity trustline already exists");
        }
        console.log("");

        // Step 3: Send HUNGER tokens to liquidity wallet
        console.log("📋 STEP 3: Sending HUNGER to Liquidity Wallet...");
        console.log("-".repeat(40));
        
        const updatedDistributor = await server.loadAccount(distributorKeypair.publicKey());

        const sendTransaction = new StellarSDK.TransactionBuilder(updatedDistributor, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.payment({
            destination: liquidityKeypair.publicKey(),
            asset: customToken,
            amount: HUNGER_FOR_POOL,
        }))
        .build();

        sendTransaction.sign(distributorKeypair);

        console.log("⏳ Sending HUNGER tokens...");
        const sendResult = await server.submitTransaction(sendTransaction);
        console.log(`✅ ${HUNGER_FOR_POOL} HUNGER sent! TX: ${sendResult.hash}`);
        console.log("");

        // Verify balances
        console.log("📋 VERIFICATION:");
        console.log("-".repeat(40));
        
        const finalLiqAccount = await server.loadAccount(liquidityKeypair.publicKey());
        
        console.log("Liquidity Wallet Balances:");
        finalLiqAccount.balances.forEach((balance) => {
            if (balance.asset_type === "native") {
                console.log(`  PI: ${balance.balance}`);
            } else {
                console.log(`  ${balance.asset_code}: ${balance.balance}`);
            }
        });
        console.log("");

        // Summary
        console.log("=".repeat(60));
        console.log("🎉 LIQUIDITY POOL SETUP COMPLETE!");
        console.log("=".repeat(60));
        console.log("");
        console.log("📊 LIQUIDITY DETAILS:");
        console.log(`  HUNGER in Pool:   ${HUNGER_FOR_POOL}`);
        console.log(`  PI in Pool:       ${PI_FOR_POOL}`);
        console.log(`  Pool Address:     ${liquidityKeypair.publicKey()}`);
        console.log("");
        console.log("📋 NEXT STEPS:");
        console.log("  1. Go to Pi Wallet > Tokens > Liquidity Pools");
        console.log("  2. Click 'Create New Pool'");
        console.log("  3. Select HUNGER and PI, enter amounts");
        console.log("  4. Create the pool!");
        console.log("");
        console.log("💡 TIP: Users can now swap their PI for HUNGER tokens!");
        console.log("=".repeat(60));

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        if (error.response) {
            console.error("Response:", error.response.data);
        }
        process.exit(1);
    }
}

setupLiquidity();
