import { NextResponse } from 'next/server';

import { geocodeQueryFallbacks } from '@/lib/geoSearch';

const NOMINATIM =
  'https://nominatim.openstreetmap.org/search?format=json&limit=1';

async function nominatimOnce(
  q: string,
  signal: AbortSignal
): Promise<{ latitude: number; longitude: number } | null> {
  const res = await fetch(`${NOMINATIM}&q=${encodeURIComponent(q)}`, {
    signal,
    headers: {
      'User-Agent': 'TheMonkeysApp/1.0 (contact@monkeys.com.co)',
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as { lat?: string; lon?: string }[];
  const lat = Number(rows?.[0]?.lat);
  const lng = Number(rows?.[0]?.lon);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat === 0 ||
    lng === 0
  ) {
    return null;
  }
  return { latitude: lat, longitude: lng };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() || '';
  const near = url.searchParams.get('near')?.trim() || '';
  if (!q) {
    return NextResponse.json({ error: 'missing q' }, { status: 400 });
  }

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    for (const candidate of geocodeQueryFallbacks(q, near)) {
      if (ctrl.signal.aborted) break;
      try {
        const pin = await nominatimOnce(candidate, ctrl.signal);
        if (pin) return NextResponse.json(pin);
      } catch {
        if (ctrl.signal.aborted) break;
      }
    }
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  } finally {
    clearTimeout(timer);
  }
}
