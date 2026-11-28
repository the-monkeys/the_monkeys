import { NextRequest } from 'next/server';

import { API_URL } from '@/constants/api';
import {
  imageAccessPolicy,
  imageSessionHeaders,
} from '@/lib/sensitiveImagePolicy';

export const dynamic = 'force-dynamic';
const privateHeaders = {
  'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'Netlify-Vary': 'query',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy':
    "default-src 'none'; style-src 'unsafe-inline'; sandbox",
};
function denied(status = 404) {
  return new Response(null, { status, headers: privateHeaders });
}
function privateHost(host: string) {
  return /^(?:localhost$|127\.|0\.|10\.|192\.168\.|169\.254\.|172\.(?:1[6-9]|2\d|3[01])\.|\[(?:::|f[cd][0-9a-f]{2}:|fe80:))/i.test(
    host
  );
}
export async function GET(req: NextRequest) {
  const source = req.nextUrl.searchParams.get('url');
  if (!source)
    return new Response('Missing image URL', {
      status: 400,
      headers: privateHeaders,
    });
  let current: URL;
  try {
    current = new URL(source, req.nextUrl.origin);
  } catch {
    return denied(400);
  }
  const owned = new Set([req.nextUrl.origin]);
  try {
    if (API_URL) owned.add(new URL(API_URL).origin);
  } catch {
    /* Policy check fails closed for invalid API configuration. */
  }
  try {
    for (let redirects = 0; redirects < 6; redirects++) {
      if (
        !['http:', 'https:'].includes(current.protocol) ||
        current.username ||
        current.password
      )
        return denied(400);
      if (privateHost(current.hostname) && !owned.has(current.origin))
        return denied(400);
      const policy = await imageAccessPolicy(
        current.toString(),
        req.nextUrl.origin,
        API_URL,
        req.headers
      );
      if (!policy.allowed) return denied();
      // Cookies/tokens are never sent to third-party image hosts or their redirects.
      const headers = owned.has(current.origin)
        ? imageSessionHeaders(req.headers)
        : new Headers();
      headers.set('Accept', 'image/*');
      const response = await fetch(current.toString(), {
        headers,
        cache: 'no-store',
        redirect: 'manual',
        signal: AbortSignal.timeout(10000),
      });
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get('location');
        await response.body?.cancel();
        if (!location) return denied();
        current = new URL(location, current);
        continue;
      }
      if (!response.ok) return denied();
      const type = response.headers.get('content-type') || '';
      if (!type.toLowerCase().startsWith('image/')) {
        await response.body?.cancel();
        return denied(415);
      }
      return new Response(await response.arrayBuffer(), {
        status: 200,
        headers: { ...privateHeaders, 'Content-Type': type },
      });
    }
    return denied(400);
  } catch {
    return new Response('Failed to fetch image', {
      status: 503,
      headers: privateHeaders,
    });
  }
}
