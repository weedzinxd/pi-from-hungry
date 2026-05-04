import { NextResponse } from 'next/server';
import { parseContractEvent } from '@/lib/event-parser';
import { fetchExternalApi } from '@/lib/server-api';

const rpcUrl = process.env.SOROBAN_RPC_URL ?? process.env.PI_RPC_URL ?? process.env.NEXT_PUBLIC_PI_RPC_URL ?? 'https://rpc.testnet.minepi.com';
const contractId = process.env.CONTRACT_ID ?? process.env.NEXT_PUBLIC_CONTRACT_ID ?? '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startLedger = Number(searchParams.get('startLedger') ?? '0');
  const limit = Number(searchParams.get('limit') ?? '25');

  try {
    const apiResponse = await fetchExternalApi<{
      contractId: string;
      latestLedger: number;
      source: 'rpc' | 'indexer' | 'fallback' | 'unconfigured';
      events: Array<Record<string, unknown>>;
    }>(`/contract-events?startLedger=${startLedger}&limit=${limit}`);

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // Fallback below.
  }

  if (!contractId) {
    return NextResponse.json({ events: [], contractId: '', source: 'unconfigured' }, { status: 200 });
  }

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getEvents',
        params: {
          startLedger,
          limit,
          type: 'contract',
        },
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const json = (await response.json()) as {
      result?: { events?: Array<Record<string, unknown>>; latestLedger?: number };
    };

    const events = (json.result?.events ?? [])
      .filter((event) => event.contractId === contractId)
      .map((event) => ({ ...event, parsed: parseContractEvent(event) }));

    return NextResponse.json({
      contractId,
      latestLedger: json.result?.latestLedger ?? 0,
      events,
      source: 'rpc',
    });
  } catch {
    return NextResponse.json({
      contractId,
      latestLedger: 0,
      events: [],
      source: 'fallback',
    });
  }
}
