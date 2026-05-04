import { NextResponse } from 'next/server';
import { fetchExternalApi } from '@/lib/server-api';

export async function GET() {
  try {
    const apiResponse = await fetchExternalApi<{
      source: 'file-store' | 'unavailable';
      feed: Array<unknown>;
    }>('/pi-payments/feed');

    if (apiResponse) {
      return NextResponse.json(apiResponse, { status: 200 });
    }
  } catch {
    // fallback below
  }

  return NextResponse.json({ source: 'unavailable', feed: [] }, { status: 200 });
}
