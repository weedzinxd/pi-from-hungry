export const dashboardConfig = {
  appName: 'Pi From Hungry',
  rpcUrl: process.env.NEXT_PUBLIC_PI_RPC_URL ?? 'https://rpc.testnet.minepi.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080',
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID ?? '',
  featureFlags: {
    liveRpc: true,
    mockHotspotsFallback: true,
  },
} as const;
