import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOST = 'www.star.nesdis.noaa.gov';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return NextResponse.json({ error: 'missing url' }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: 'invalid url' }, { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return NextResponse.json({ error: 'forbidden host' }, { status: 403 });
  }

  const response = await fetch(parsed.toString(), {
    headers: {
      'User-Agent': 'Mozilla/5.0 PiFromHungry/1.0',
      Accept: 'image/png,image/*;q=0.9,*/*;q=0.8',
      Referer: 'https://pi-from-hungry-dashboardxd.vercel.app/',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ error: `upstream ${response.status}` }, { status: 502 });
  }

  const contentType = response.headers.get('content-type') ?? 'image/png';
  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
