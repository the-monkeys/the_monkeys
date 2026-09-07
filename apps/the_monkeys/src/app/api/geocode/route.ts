import { NextResponse } from 'next/server';

const NOMINATIM =
  'https://nominatim.openstreetmap.org/search?format=json&limit=1';

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get('q')?.trim() || '';
  if (!q) {
    return NextResponse.json({ error: 'missing q' }, { status: 400 });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5000);
  try {
    const res = await fetch(`${NOMINATIM}&q=${encodeURIComponent(q)}`, {
      signal: ctrl.signal,
      headers: {
        'User-Agent': 'TheMonkeysApp/1.0 (contact@monkeys.com.co)',
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    const rows = (await res.json()) as { lat?: string; lon?: string }[];
    const lat = Number(rows?.[0]?.lat);
    const lng = Number(rows?.[0]?.lon);
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      lat === 0 ||
      lng === 0
    ) {
      return NextResponse.json({ error: 'not found' }, { status: 404 });
    }
    return NextResponse.json({ latitude: lat, longitude: lng });
  } catch {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  } finally {
    clearTimeout(timer);
  }
}
