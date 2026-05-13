import { NextRequest, NextResponse } from 'next/server';
import { loadLocalPiPaymentIntents } from '@/lib/local-demo';
import { getExternalApiBaseUrl } from '@/lib/server-api';

async function localList() {
  return NextResponse.json({ source: 'file-store', intents: await loadLocalPiPaymentIntents() }, { status: 200 });
}

export async function GET() {
  const baseUrl = getExternalApiBaseUrl();
  if (!baseUrl) {
    return localList();
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
    return NextResponse.json({ detail: 'External API not configured. Public cloud demo is running in read-only mode today.' }, { status: 503 });
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
