import { NextResponse } from 'next/server';
import { mockCrisisEvents } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json(mockCrisisEvents, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
