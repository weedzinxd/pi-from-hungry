import { NextRequest, NextResponse } from 'next/server';
import { getExternalApiBaseUrl } from '@/lib/server-api';

export async function POST(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const baseUrl = getExternalApiBaseUrl();

  if (!baseUrl) {
    return NextResponse.json({ source: 'unavailable', intent: null, note: 'External API not configured.' }, { status: 503 });
  }

  const response = await fetch(`${baseUrl}/pi-payments/intents/${id}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
