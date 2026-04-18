# 🍽️ HUNGER Token - Complete Setup Guide

## Quick Reference

### Your Wallet (Testnet)
```
GAORA7V3H4RWZARFWUJANNDL4HT5S2FFNNQU7TEFF4FOSYTDE6B6HTLW
```

### Setup Commands

```bash
# 1. Go to token directory
cd /home/weed/pi-from-hungry/token-scripts

# 2. Install dependencies
npm install

# 3. Set your secrets
export ISSUER_SECRET="your-issuer-secret"
export DISTRIBUTOR_SECRET="your-distributor-secret"

# 4. Create token
npm run create-token
```

## What This Does

1. Creates HUNGER token on Pi Testnet
2. Mints 1 billion tokens
3. Locks the issuer (no more minting)
4. Sets up for Pi Wallet listing

## Next Steps

1. Get Test-Pi from faucet: https://testnet.pinet.com/faucet/
2. Get your wallet secrets from Pi Wallet
3. Run the setup
4. Create liquidity pool
5. Start swapping!

## Questions?

GitHub: https://github.com/weedzinxd/pi-from-hungry
Twitter: @WeedzinxD
