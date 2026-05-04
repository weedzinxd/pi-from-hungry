import { NextRequest, NextResponse } from 'next/server';
import { getExternalApiBaseUrl } from '@/lib/server-api';

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const baseUrl = getExternalApiBaseUrl();

  if (!baseUrl) {
    return NextResponse.json(
      {
        source: 'unavailable',
        verified: false,
        session: null,
        note: 'External API not configured for Pi auth verification.',
      },
      { status: 200 }
    );
  }

  const response = await fetch(`${baseUrl}/pi-auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
