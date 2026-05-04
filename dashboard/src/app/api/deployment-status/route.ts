import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

const contractId = process.env.CONTRACT_ID ?? process.env.NEXT_PUBLIC_CONTRACT_ID ?? '';
const rpcUrl = process.env.SOROBAN_RPC_URL ?? process.env.PI_RPC_URL ?? process.env.NEXT_PUBLIC_PI_RPC_URL ?? 'https://rpc.testnet.minepi.com';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      contractId: string;
      network: string;
      rpcUrl: string;
      source: 'deployment-file' | 'environment' | 'unconfigured';
      deployment: {
        wasmHash?: string;
        timestamp?: string;
        networkPassphrase?: string;
        ledger?: number;
      } | null;
    }>('/deployment-status');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json(
    {
      contractId,
      network: 'Pi Testnet',
      rpcUrl,
      source: contractId ? 'environment' : 'unconfigured',
      deployment: null,
    },
    { status: 200 },
  );
}
