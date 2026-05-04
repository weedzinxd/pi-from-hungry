# Environment Reference

## Root `.env`
```env
PI_RPC_URL=https://rpc.testnet.minepi.com
SOROBAN_RPC_URL=https://rpc.testnet.minepi.com
NETWORK_PASSPHRASE=Pi Testnet
CONTRACT_ID=
OPERATOR_ADDRESS=
TREASURY_ADDRESS=
API_URL=http://localhost:8080
API_CORS_ORIGINS=["http://localhost:3000"]
API_DATA_FILE=./data/demo-hotspots.json
API_HOTSPOTS_SOURCE=auto
PIPELINE_DATA_FILE=./data/curated-hotspots.json
NEXT_PUBLIC_PI_RPC_URL=https://rpc.testnet.minepi.com
NEXT_PUBLIC_CONTRACT_ID=
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Vercel envs
```env
NEXT_PUBLIC_API_URL=https://your-api.onrender.com
API_URL=https://your-api.onrender.com
NEXT_PUBLIC_PI_RPC_URL=https://rpc.testnet.minepi.com
NEXT_PUBLIC_CONTRACT_ID=YOUR_TESTNET_CONTRACT_ID
```

## Render/Railway envs
```env
PI_RPC_URL=https://rpc.testnet.minepi.com
SOROBAN_RPC_URL=https://rpc.testnet.minepi.com
CONTRACT_ID=YOUR_TESTNET_CONTRACT_ID
API_HOTSPOTS_SOURCE=auto
```

## Recommended publication defaults
- keep `API_HOTSPOTS_SOURCE=auto`
- generate `data/curated-hotspots.json` with `npm run pi:pipeline:build`
- configure `CONTRACT_ID` if a real testnet contract is available
- refresh `data/indexed-events.json` before demos
