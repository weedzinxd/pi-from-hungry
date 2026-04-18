/**
 * HUNGER Token Creator - Pi From Hungry
 * 
 * This script creates the HUNGER token on Pi Testnet
 * 
 * TOKENOMICS:
 * - Name: HUNGER
 * - Symbol: HGR
 * - Total Supply: 1,000,000,000 (1B tokens)
 * - Purpose: End global hunger using blockchain technology
 * - Decimals: 0 (whole tokens only)
 */

const StellarSDK = require("@stellar/stellar-sdk");

// Pi Testnet Configuration
const server = new StellarSDK.Horizon.Server("https://api.testnet.minepi.com");
const NETWORK_PASSPHRASE = "Pi Testnet";

// Token Configuration
const TOKEN_CODE = "HUNGER";
const TOKEN_NAME = "Pi From Hungry Humanitarian Token";
const TOKEN_DESCRIPTION = "Humanitarian token to end global hunger. Each token represents a contribution to the GVC (Global Value Chain) protocol for transparent, efficient hunger relief. Built on Pi Network blockchain for maximum impact and zero corruption.";
const TOKEN_IMAGE = "https://raw.githubusercontent.com/weedzinxd/pi-from-hungry/main/assets/hunger-token.png";

// Wallet Configuration
// ISSUER: Creates and issues the token (your main wallet for now)
// DISTRIBUTOR: Distributes tokens to the community
const ISSUER_SECRET = process.env.ISSUER_SECRET || "";
const DISTRIBUTOR_SECRET = process.env.DISTRIBUTOR_SECRET || "";

// Token Supply Configuration
const INITIAL_MINT_AMOUNT = "1000000000"; // 1 billion tokens
const LOCKED_AMOUNT = "900000000"; // 900M locked for humanitarian use
const DISTRIBUTABLE_AMOUNT = "100000000"; // 100M for community/pool

async function createToken() {
    try {
        console.log("=".repeat(60));
        console.log("🍽️  PI FROM HUNGRY - HUNGER TOKEN CREATOR");
        console.log("=".repeat(60));
        console.log("");
        
        // Validate secrets
        if (!ISSUER_SECRET || !DISTRIBUTOR_SECRET) {
            console.log("❌ ERROR: Please set ISSUER_SECRET and DISTRIBUTOR_SECRET");
            console.log("");
            console.log("Export your wallet secrets:");
            console.log('export ISSUER_SECRET="your-issuer-secret"');
            console.log('export DISTRIBUTOR_SECRET="your-distributor-secret"');
            console.log("");
            console.log("Get your wallet secrets from Pi Wallet > Settings > View Secret Key");
            process.exit(1);
        }

        // Create keypairs
        const issuerKeypair = StellarSDK.Keypair.fromSecret(ISSUER_SECRET);
        const distributorKeypair = StellarSDK.Keypair.fromSecret(DISTRIBUTOR_SECRET);

        console.log("📝 CONFIGURATION:");
        console.log("-".repeat(40));
        console.log(`Token Code:     ${TOKEN_CODE}`);
        console.log(`Token Name:     ${TOKEN_NAME}`);
        console.log(`Issuer:         ${issuerKeypair.publicKey()}`);
        console.log(`Distributor:   ${distributorKeypair.publicKey()}`);
        console.log(`Initial Mint:  ${INITIAL_MINT_AMOUNT} ${TOKEN_CODE}`);
        console.log("");

        // Create custom token asset
        const customToken = new StellarSDK.Asset(TOKEN_CODE, issuerKeypair.publicKey());

        // Step 1: Load distributor account and create trustline
        console.log("📋 STEP 1: Creating Trustline from Distributor...");
        console.log("-".repeat(40));
        
        const distributorAccount = await server.loadAccount(distributorKeypair.publicKey());
        
        // Get base fee
        const response = await server.ledgers().order("desc").limit(1).call();
        const baseFee = response.records[0].base_fee_in_stroops;

        // Build trustline transaction
        const trustlineTransaction = new StellarSDK.TransactionBuilder(distributorAccount, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.changeTrust({
            asset: customToken,
            limit: INITIAL_MINT_AMOUNT
        }))
        .build();

        trustlineTransaction.sign(distributorKeypair);

        // Submit trustline
        console.log("⏳ Submitting trustline transaction...");
        const trustlineResult = await server.submitTransaction(trustlineTransaction);
        console.log(`✅ Trustline created! TX: ${trustlineResult.hash}`);
        console.log("");

        // Step 2: Mint tokens from issuer to distributor
        console.log("📋 STEP 2: Minting Initial Supply...");
        console.log("-".repeat(40));
        
        const issuerAccount = await server.loadAccount(issuerKeypair.publicKey());

        const mintTransaction = new StellarSDK.TransactionBuilder(issuerAccount, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.payment({
            destination: distributorKeypair.publicKey(),
            asset: customToken,
            amount: INITIAL_MINT_AMOUNT,
        }))
        .build();

        mintTransaction.sign(issuerKeypair);

        // Submit mint transaction
        console.log("⏳ Minting tokens...");
        const mintResult = await server.submitTransaction(mintTransaction);
        console.log(`✅ ${INITIAL_MINT_AMOUNT} ${TOKEN_CODE} minted! TX: ${mintResult.hash}`);
        console.log("");

        // Step 3: Lock the issuer account (best practice)
        console.log("📋 STEP 3: Locking Issuer Account...");
        console.log("-".repeat(40));
        
        const lockTransaction = new StellarSDK.TransactionBuilder(issuerAccount, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.setOptions({
            // Set a high weight for master key to disable it
            masterWeight: 0,
            // Require all transactions to be signed by issuer
            lowThreshold: 1,
            medThreshold: 1,
            highThreshold: 1,
        }))
        .build();

        lockTransaction.sign(issuerKeypair);

        console.log("⏳ Locking issuer account...");
        const lockResult = await server.submitTransaction(lockTransaction);
        console.log(`✅ Issuer locked! TX: ${lockResult.hash}`);
        console.log("⚠️  WARNING: Issuer account is now locked. No more tokens can be minted!");
        console.log("");

        // Step 4: Set Home Domain for Pi Wallet listing
        console.log("📋 STEP 4: Setting Home Domain...");
        console.log("-".repeat(40));
        console.log("⚠️  NOTE: You need to host a pi.toml file at your domain");
        console.log(`   Home Domain: hunger.pifromhungry.org`);
        console.log("");
        
        const homeDomainAccount = await server.loadAccount(issuerKeypair.publicKey());
        
        const homeDomainTransaction = new StellarSDK.TransactionBuilder(homeDomainAccount, {
            fee: baseFee,
            networkPassphrase: NETWORK_PASSPHRASE,
            timebounds: await server.fetchTimebounds(90),
        })
        .addOperation(StellarSDK.Operation.setOptions({
            homeDomain: "hunger.pifromhungry.org"
        }))
        .build();

        homeDomainTransaction.sign(issuerKeypair);

        console.log("⏳ Setting home domain...");
        const homeDomainResult = await server.submitTransaction(homeDomainTransaction);
        console.log(`✅ Home Domain set! TX: ${homeDomainResult.hash}`);
        console.log("");

        // Verify balances
        console.log("📋 VERIFICATION:");
        console.log("-".repeat(40));
        const updatedDistributor = await server.loadAccount(distributorKeypair.publicKey());
        
        console.log("Distributor Balances:");
        updatedDistributor.balances.forEach((balance) => {
            if (balance.asset_type === "native") {
                console.log(`  Pi Balance: ${balance.balance}`);
            } else {
                console.log(`  ${balance.asset_code}: ${balance.balance}`);
            }
        });
        console.log("");

        // Summary
        console.log("=".repeat(60));
        console.log("🎉 HUNGER TOKEN CREATED SUCCESSFULLY!");
        console.log("=".repeat(60));
        console.log("");
        console.log("📊 TOKEN DETAILS:");
        console.log(`  Name:           ${TOKEN_NAME}`);
        console.log(`  Code:           ${TOKEN_CODE}`);
        console.log(`  Total Supply:   ${INITIAL_MINT_AMOUNT} ${TOKEN_CODE}`);
        console.log(`  Issuer:         ${issuerKeypair.publicKey()}`);
        console.log(`  Distributor:    ${distributorKeypair.publicKey()}`);
        console.log("");
        console.log("📋 NEXT STEPS:");
        console.log("  1. Host pi.toml file at: https://hunger.pifromhungry.org/.well-known/pi.toml");
        console.log("  2. Create Liquidity Pool in Pi Wallet");
        console.log("  3. Add HUNGER token to your wallet");
        console.log("  4. Start swapping for HUNGER tokens!");
        console.log("");
        console.log("🔗 EXPLORER LINKS:");
        console.log(`  Issuer:  https://api.testnet.minepi.com/accounts/${issuerKeypair.publicKey()}`);
        console.log(`  Dist:    https://api.testnet.minepi.com/accounts/${distributorKeypair.publicKey()}`);
        console.log("");
        console.log("💝 Together, we can end hunger!");
        console.log("=".repeat(60));

    } catch (error) {
        console.error("❌ ERROR:", error.message);
        if (error.response) {
            console.error("Response:", error.response.data);
        }
        process.exit(1);
    }
}

createToken();
