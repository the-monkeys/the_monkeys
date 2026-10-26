import { NextRequest } from 'next/server';

import sharp from 'sharp';

export const dynamic = 'force-dynamic';

const MIN_WIDTH = 16;
const MAX_WIDTH = 2048;
const WEBP_QUALITY = 70;
const OPTIMIZED_CACHE_CONTROL =
  'public, max-age=86400, s-maxage=31536000, immutable';
const PASSTHROUGH_CACHE_CONTROL = 'no-cache, no-store, must-revalidate';

function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  if (host === '::1' || host === '0:0:0:0:0:0:0:1') return true;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4) return false;

  const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function resolveTarget(raw: string | null): URL | null {
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;

    const allowPrivate = process.env.NODE_ENV !== 'production';
    if (!allowPrivate && isPrivateHostname(url.hostname)) return null;

    return url;
  } catch {
    return null;
  }
}

function parseWidth(value: string | null): number | null {
  if (!value) return null;

  const width = Number.parseInt(value, 10);
  if (!Number.isFinite(width) || width < MIN_WIDTH || width > MAX_WIDTH) {
    return null;
  }

  return width;
}

export async function GET(req: NextRequest) {
  const target = resolveTarget(req.nextUrl.searchParams.get('url'));

  if (!target) {
    return new Response('Invalid image URL', { status: 400 });
  }

  try {
    const res = await fetch(target);
    if (!res.ok) {
      return new Response('Failed to fetch image', { status: 502 });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = Buffer.from(await res.arrayBuffer());
    const width = parseWidth(req.nextUrl.searchParams.get('w'));

    if (!width || !contentType.startsWith('image/')) {
      return new Response(new Uint8Array(imageBuffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': PASSTHROUGH_CACHE_CONTROL,
          Pragma: 'no-cache',
          Expires: '0',
          'Netlify-Vary': 'query',
        },
      });
    }

    const optimized = await sharp(imageBuffer)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    return new Response(new Uint8Array(optimized), {
      status: 200,
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': OPTIMIZED_CACHE_CONTROL,
        'Netlify-Vary': 'query',
      },
    });
  } catch {
    return new Response('Failed to fetch image', { status: 500 });
  }
}
