import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      name: 'Pi From Hungry Dashboard',
      status: 'ok',
      environment: process.env.NODE_ENV ?? 'production',
      mode: 'standalone-public-demo',
    },
    { status: 200 },
  );
}
