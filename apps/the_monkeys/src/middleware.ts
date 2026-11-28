import { NextRequest, NextResponse } from 'next/server';

// Next removes its internal router headers before Server Components read them.
// Classify the raw request here; this marker is not crawler authorization.
export function middleware(request: NextRequest) {
  if (process.env.NSFW_SEO_ENABLED !== '1') return NextResponse.next();
  const headers = new Headers(request.headers);
  const internal = [
    'rsc',
    'next-router-prefetch',
    'next-router-state-tree',
    'next-action',
    'next-url',
  ].some((name) => headers.has(name));
  const prefetch = /prefetch/i.test(
    (headers.get('purpose') || '') + ' ' + (headers.get('sec-purpose') || '')
  );
  // Always overwrite a caller-supplied marker.
  headers.set(
    'x-monkeys-crawler-request-kind',
    request.method === 'GET' && !internal && !prefetch
      ? 'document'
      : 'subrequest'
  );
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ['/blog/:path*'] };
