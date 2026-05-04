import { NextRequest, NextResponse } from 'next/server';
import { getExternalApiBaseUrl } from '@/lib/server-api';

function unavailableList() {
  return NextResponse.json({ source: 'unavailable', intents: [] }, { status: 200 });
}

export async function GET() {
  const baseUrl = getExternalApiBaseUrl();
  if (!baseUrl) {
    return unavailableList();
  }

  const response = await fetch(`${baseUrl}/pi-payments/intents`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: NextRequest) {
  const baseUrl = getExternalApiBaseUrl();
  if (!baseUrl) {
    return NextResponse.json({ detail: 'External API not configured for Pi payment intents.' }, { status: 503 });
  }

  const payload = await request.json();
  const response = await fetch(`${baseUrl}/pi-payments/intents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
