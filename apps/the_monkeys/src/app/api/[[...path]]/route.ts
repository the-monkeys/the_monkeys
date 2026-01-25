import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';

async function proxyRequest(req: Request, params?: { path: string[] }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('mat');
  const apiOrigin = new URL(API_URL!).origin;

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const clientUrl = new URL(req.url);
  const upstreamPath = params?.path
    ? `/api/${params.path.join('/')}`
    : clientUrl.pathname;
  const targetUrl = `${apiOrigin}${upstreamPath}${clientUrl.search}`;

  try {
    // Fetch Stream and pass directly in the body
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body:
        req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      cache: 'no-store',
      // @ts-ignore: Required for Node.js bi-directional streaming
      duplex: 'half',
    });

    const responseHeaders = new Headers(response.headers);

    // content compression should be handled by browser itself
    responseHeaders.delete('content-encoding');

    responseHeaders.delete('set-cookie');
    if (typeof response.headers.getSetCookie === 'function') {
      for (const cookie of response.headers.getSetCookie()) {
        responseHeaders.append('Set-Cookie', cookie);
      }
    } else {
      const sc = response.headers.get('Set-Cookie');
      if (sc) responseHeaders.set('Set-Cookie', sc);
    }

    // Return Stream
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
