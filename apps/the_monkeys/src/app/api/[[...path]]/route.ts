import { cookies } from 'next/headers';

import { API_URL, API_URL_V2 } from '@/constants/api';

async function proxyRequest(req: Request) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('mat');

  const clientUrl = new URL(req.url);
  const isV2 =
    clientUrl.pathname.startsWith('/api/v2') ||
    clientUrl.pathname.startsWith('/v2');

  const baseEndpoint = isV2 && API_URL_V2 ? API_URL_V2 : API_URL;
  if (!baseEndpoint) {
    return new Response(
      JSON.stringify({ error: 'API base URL not configured' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  const apiOrigin = new URL(baseEndpoint).origin;

  const headers = new Headers(req.headers);
  if (authToken && !headers.get('Authorization')) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }
  headers.set('Accept-Encoding', '*');
  // Strip client host and connection headers so the upstream reverse proxy/server receives correct host
  headers.delete('host');
  headers.delete('connection');

  const targetUrl = `${apiOrigin}${clientUrl.pathname}${clientUrl.search}`;
  const hasBody =
    req.method !== 'GET' && req.method !== 'HEAD' && req.body !== null;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody ? req.body : undefined,
      cache: 'no-store',
      // @ts-ignore: Required for Node.js bi-directional streaming
      duplex: hasBody ? 'half' : undefined,
    });

    const responseHeaders = new Headers(response.headers);
    if (typeof response.headers.getSetCookie === 'function') {
      for (const cookie of response.headers.getSetCookie()) {
        responseHeaders.append('Set-Cookie', cookie);
      }
    } else {
      const sc = response.headers.get('Set-Cookie');
      if (sc) responseHeaders.set('Set-Cookie', sc);
    }

    // Prevent Netlify Edge CDN and browser from caching mutable storage assets (profiles, etc.)
    if (clientUrl.pathname.includes('/storage/')) {
      responseHeaders.set(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      );
      responseHeaders.set('Expires', '0');
      responseHeaders.set('Netlify-Vary', 'query');
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'Proxy Connection Failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
