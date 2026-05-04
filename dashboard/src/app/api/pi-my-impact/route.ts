import { NextRequest, NextResponse } from 'next/server';
import { getExternalApiBaseUrl } from '@/lib/server-api';

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username') ?? '';
  const baseUrl = getExternalApiBaseUrl();

  if (!baseUrl || !username) {
    return NextResponse.json(
      {
        source: 'unavailable',
        username,
        totals: { intents: 0, approved: 0, completed: 0, totalPi: 0, completedPi: 0 },
        badges: [],
        latestIntents: [],
      },
      { status: 200 }
    );
  }

  const response = await fetch(`${baseUrl}/pi-payments/my-impact?username=${encodeURIComponent(username)}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
