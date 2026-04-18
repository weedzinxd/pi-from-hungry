/**
 * Pi From Hungry - Complete Setup Guide
 * 
 * This guide will help you set up the HUNGER token on Pi Testnet
 */

const fs = require('fs');

const guide = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🍽️  PI FROM HUNGRY - HUNGER TOKEN SETUP GUIDE               ║
║                                                                  ║
║   Complete step-by-step guide to create your humanitarian         ║
║   token on Pi Network Testnet                                    ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝

📋 PREREQUISITES
═══════════════════════════════════════════════════════════════════

1. Pi Wallet installed on your phone
2. Two (2) activated wallets on Pi Testnet
3. Get Test-Pi from faucet: https://testnet.pinet.com/faucet/
4. Node.js installed on your computer

═══════════════════════════════════════════════════════════════════

🎯 STEP 1: GET TEST-PI FROM FAUCET
═══════════════════════════════════════════════════════════════════

1. Go to: https://testnet.pinet.com/faucet/
2. Enter your testnet wallet address
3. Click "Request Test-Pi"
4. Wait for 10-20 Test-Pi to arrive

NOTE: You'll need at least 10,000 Test-Pi for the liquidity pool
      Request multiple times if needed (may have rate limits)

═══════════════════════════════════════════════════════════════════

🔐 STEP 2: GET YOUR WALLET SECRETS
═══════════════════════════════════════════════════════════════════

For EACH wallet (you need 2):

1. Open Pi Wallet app
2. Go to: Settings > View Secret Key
3. Copy the secret key (starts with 'S')
4. Save it securely - this is your password to the wallet!

WALLET ROLES:
• ISSUER: Creates and "owns" the token (we recommend using your main wallet)
• DISTRIBUTOR: Holds and distributes tokens (can be secondary wallet)

═══════════════════════════════════════════════════════════════════

💻 STEP 3: INSTALL DEPENDENCIES
═══════════════════════════════════════════════════════════════════

Run these commands:

cd /home/weed/pi-from-hungry/token-scripts
npm install

This will install:
• @stellar/stellar-sdk (for blockchain interactions)

═══════════════════════════════════════════════════════════════════

⚙️  STEP 4: SET YOUR SECRETS
═══════════════════════════════════════════════════════════════════

Export your wallet secrets as environment variables:

For Issuer Wallet:
export ISSUER_SECRET="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

For Distributor Wallet:
export DISTRIBUTOR_SECRET="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

For Liquidity Wallet (optional, can be same as distributor):
export LIQUIDITY_SECRET="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

═══════════════════════════════════════════════════════════════════

🚀 STEP 5: CREATE THE HUNGER TOKEN
═══════════════════════════════════════════════════════════════════

Run the token creation script:

npm run create-token

This will:
✅ Create trustline from distributor to token
✅ Mint 1,000,000,000 (1 billion) HUNGER tokens
✅ Lock the issuer account (no more minting possible)
✅ Set home domain for Pi Wallet listing
✅ Display all transaction hashes

═══════════════════════════════════════════════════════════════════

🏦 STEP 6: SETUP LIQUIDITY POOL
═══════════════════════════════════════════════════════════════════

Run the liquidity pool script:

npm run setup-liquidity

This will:
✅ Create trustline for liquidity wallet
✅ Send 100,000,000 HUNGER to liquidity wallet
✅ Prepare for pool creation

Then in Pi Wallet:
1. Open Pi Wallet
2. Go to: Tokens > Liquidity Pools
3. Click "Create New Pool"
4. Select: HUNGER / PI
5. Enter amounts: 100M HUNGER + 10,000 PI
6. Confirm creation

═══════════════════════════════════════════════════════════════════

📱 STEP 7: ADD TOKEN TO PI WALLET
═══════════════════════════════════════════════════════════════════

1. Open Pi Wallet
2. Go to: Tokens
3. Click "+" or "Add Token"
4. Search: "HUNGER"
5. Click "Add"
6. Confirm trustline creation

Your HUNGER tokens should now appear!

═══════════════════════════════════════════════════════════════════

🔄 STEP 8: SWAP PI FOR HUNGER
═══════════════════════════════════════════════════════════════════

1. Go to: Tokens > Swap
2. From: PI
3. To: HUNGER
4. Enter amount
5. Confirm swap
6. Done! You've contributed to ending hunger! 🍽️

═══════════════════════════════════════════════════════════════════

🌐 STEP 9: HOST PI.TOML (FOR WALLET LISTING)
═══════════════════════════════════════════════════════════════════

For your token to appear in Pi Wallet automatically:

1. Host this file at:
   https://your-domain.com/.well-known/pi.toml

2. The file content is in: token-scripts/pi.toml

3. Make sure it's accessible via HTTPS

4. In your issuer wallet, set home domain:
   - Go to Pi Wallet settings
   - Find "Home Domain" option
   - Enter your domain (e.g., hunger.pifromhungry.org)

═══════════════════════════════════════════════════════════════════

📊 TOKENOMICS
═══════════════════════════════════════════════════════════════════

Total Supply: 1,000,000,000 HUNGER

Allocation:
• 700,000,000 (70%) - Humanitarian Reserve (LOCKED)
• 100,000,000 (10%) - Liquidity Pool
• 100,000,000 (10%) - Community Rewards
• 100,000,000 (10%) - Team & Development

Value Proposition:
• 1 HUNGER = $0.0000064 USD (at launch)
• 1 HUNGER = Enough to feed 0.04 people for a day
• 100 HUNGER = 1 GVC unit = ~$0.64 USD
• 1 GVC = 4,272 people fed per year

═══════════════════════════════════════════════════════════════════

🎯 THE MATH: ENDING HUNGER
═══════════════════════════════════════════════════════════════════

Global Hunger Statistics:
• 228,300,000 people affected
• $150/year to feed one person (WFP estimate)
• Total annual cost: $34.2 BILLION

With GVC + HUNGER Token:
• 314,159 PI = 1 GVC unit = $64 USD
• 1 GVC = 4,272 people fed
• 533,946 GVC units needed = 167.7 BILLION PI
• Total: 2.28 BILLION people helped

Your Contribution:
• Buy HUNGER tokens
• Swap for PI
• Provide liquidity
• Every token = Direct impact!

═══════════════════════════════════════════════════════════════════

🛠️  TROUBLESHOOTING
═══════════════════════════════════════════════════════════════════

ERROR: "Invalid secret key"
→ Make sure you're using the secret key (starts with 'S'), not the public key

ERROR: "Insufficient balance"
→ Make sure you have enough Test-Pi for fees (~1-2 PI)

ERROR: "Trustline not established"
→ Wait a few seconds and retry, blockchain needs to sync

ERROR: "Sequence number mismatch"
→ Run the script again, it will fetch the latest sequence

═══════════════════════════════════════════════════════════════════

💬 NEED HELP?
═══════════════════════════════════════════════════════════════════

GitHub Issues:
https://github.com/weedzinxd/pi-from-hungry/issues

Twitter:
@WeedzinxD

Pi Network Community:
Search "Pi From Hungry" in Pi Browser

═══════════════════════════════════════════════════════════════════

🎉 CONGRATULATIONS!
═══════════════════════════════════════════════════════════════════

You're now part of the movement to end global hunger!

Together, we can make a difference.

#PiFromHungry #EndHunger #GVC #PiNetwork

═══════════════════════════════════════════════════════════════════
`;

// Print the guide
console.log(guide);

// Save to file
fs.writeFileSync('SETUP_GUIDE.txt', guide);
console.log('Guide saved to: SETUP_GUIDE.txt');
