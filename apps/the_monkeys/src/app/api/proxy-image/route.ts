import { NextRequest } from 'next/server';
import dns from 'node:dns/promises';
import net from 'node:net';

export const runtime = 'nodejs';

const PRIVATE_RANGES = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
];

function isPrivateIp(ip: string): boolean {
  if (net.isIP(ip) === 6) {
    return (
      ip === '::1' ||
      ip.startsWith('fc') ||
      ip.startsWith('fd') ||
      ip.startsWith('fe80')
    );
  }
  return PRIVATE_RANGES.some((re) => re.test(ip));
}

async function isSafeUrl(url: URL): Promise<boolean> {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
  try {
    const { address } = await dns.lookup(url.hostname);
    return !isPrivateIp(address);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url');
  if (!raw) return new Response('Missing image URL', { status: 400 });

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new Response('Invalid image URL', { status: 400 });
  }

  if (!(await isSafeUrl(target))) {
    return new Response('Unsupported image URL', { status: 400 });
  }

  const res = await fetch(target.toString(), { redirect: 'manual' });
  if (res.status >= 300 && res.status < 400) {
    return new Response('Redirects are not supported', { status: 400 });
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    return new Response('Upstream did not return an image', { status: 502 });
  }

  const imageBuffer = await res.arrayBuffer();
  if (imageBuffer.byteLength > 10 * 1024 * 1024) {
    return new Response('Image too large', { status: 413 });
  }

  return new Response(imageBuffer, {
    status: 200,
    headers: { 'Content-Type': contentType },
  });
}