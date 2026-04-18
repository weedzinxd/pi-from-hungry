import { NextResponse } from 'next/server';
import { dashboardConfig } from '@/lib/config';

export async function GET() {
  try {
    const response = await fetch(dashboardConfig.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getHealth',
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(
        { status: 'offline', latestLedger: 0, rpcUrl: dashboardConfig.rpcUrl },
        { status: 200 },
      );
    }

    const json = (await response.json()) as {
      result?: { status: string; latestLedger: number };
    };

    return NextResponse.json({
      status: json.result?.status === 'healthy' ? 'healthy' : 'degraded',
      latestLedger: json.result?.latestLedger ?? 0,
      rpcUrl: dashboardConfig.rpcUrl,
    });
  } catch {
    return NextResponse.json({
      status: 'offline',
      latestLedger: 0,
      rpcUrl: dashboardConfig.rpcUrl,
    });
  }
}
