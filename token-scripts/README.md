# 🍽️ HUNGER Token - Pi From Hungry

**Humanitarian Token on Pi Network Testnet**

## Overview

The HUNGER token is a humanitarian cryptocurrency built on Pi Network's blockchain to revolutionize global hunger relief. Each token represents a transparent, traceable contribution to ending world hunger through the GVC (Global Value Chain) protocol.

## Tokenomics

| Parameter | Value |
|-----------|-------|
| **Token Name** | Pi From Hungry |
| **Token Symbol** | HUNGER (HGR) |
| **Total Supply** | 1,000,000,000 (1 Billion) |
| **Decimals** | 0 |
| **Network** | Pi Testnet |
| **Contract** | Stellar (SCP) |

## Token Allocation

| Allocation | Amount | Purpose |
|------------|--------|---------|
| **Humanitarian Reserve** | 700,000,000 | Locked for verified food relief programs |
| **Liquidity Pool** | 100,000,000 | Initial DEX liquidity on Pi Network |
| **Community Rewards** | 100,000,000 | Community engagement & growth |
| **Team & Development** | 100,000,000 | Platform development & operations |

## GVC Value Proposition

- **1 HUNGER Token** = Direct contribution to food relief
- **100 HUNGER Tokens** = 1 GVC unit = ~$0.64 USD
- **1 GVC (314,159 PI)** = 4,272 people fed per year
- **Total Goal**: Raise 533,946 GVC units = 2.28 billion people helped

## How It Works

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   DONOR          │───▶│   SMART         │───▶│   BENEFICIARY   │
│   (PI/HGR)      │    │   CONTRACT      │    │   (Mobile)      │
│                 │    │   (GVC Logic)   │    │                 │
│ • 100% on-chain │    │ • Auto-verify   │    │ • Instant pi    │
│ • Zero fees     │    │ • AI matching   │    │ • Food vouchers │
│ • Transparent    │    │ • Multi-sig     │    │ • Direct wallet │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Quick Start

### Prerequisites

```bash
# Install dependencies
cd token-scripts
npm install

# Set your wallet secrets
export ISSUER_SECRET="your-issuer-secret-key"
export DISTRIBUTOR_SECRET="your-distributor-secret-key"
```

### Create Token

```bash
npm run create-token
```

This will:
1. Create trustline from distributor
2. Mint 1 billion HUNGER tokens
3. Lock the issuer account
4. Set home domain for Pi Wallet listing

### Setup Liquidity Pool

```bash
export LIQUIDITY_SECRET="your-liquidity-wallet-secret"
npm run setup-liquidity
```

## Pi Wallet Integration

### Host pi.toml

Host the `pi.toml` file at:
```
https://hunger.pifromhungry.org/.well-known/pi.toml
```

### Add to Wallet

1. Open Pi Wallet
2. Go to Tokens
3. Search for "HUNGER"
4. Add trustline
5. Start transacting!

## Smart Contract Features

### GVC (Global Value Chain) Logic

- **Tier 1**: Direct food distribution ($0.15/person/day)
- **Tier 2**: Agricultural support ($50/family/month)
- **Tier 3**: School meal programs ($25/student/month)
- **Tier 4**: Emergency relief ($100/household)

### Transparency Features

- 100% on-chain transaction history
- Real-time balance verification
- Multi-signature authorization
- AI-powered impact measurement

## Development

### Project Structure

```
pi-from-hungry/
├── dashboard/           # React dashboard
├── token-scripts/        # Token creation scripts
│   ├── create_token.js   # Token creation
│   ├── liquidity_pool.js # Pool setup
│   └── pi.toml          # Token metadata
└── README.md
```

### Tech Stack

- **Blockchain**: Pi Network (Stellar SCP)
- **Smart Contracts**: Pi SDK
- **Frontend**: React + Next.js
- **Maps**: Leaflet + ESRI Satellite
- **AI**: TensorFlow.js
- **Data**: NASA FIRMS, ESA Sentinel, FAO GIEWS

## Roadmap

- [x] Token creation on Testnet
- [ ] Liquidity pool setup
- [ ] Dashboard integration
- [ ] Pi Wallet listing
- [ ] Smart contract deployment
- [ ] Mainnet migration
- [ ] Real-world pilot programs

## Contributing

Contributions welcome! Please read [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## License

MIT License - See [LICENSE](../LICENSE)

## Authors

- **@WeedzinxD** - [GitHub](https://github.com/weedzinxd) | [Twitter](https://x.com/WeedzinxD)

## Support

- GitHub Issues: https://github.com/weedzinxd/pi-from-hungry/issues
- Twitter: [@WeedzinxD](https://x.com/WeedzinxD)

---

**Together, we can end global hunger. 🍽️**
