import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';

export const dynamic = 'force-dynamic';

async function proxyRequest(req: Request, params?: { path: string[] }) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('mat');
  const apiOrigin = new URL(API_URL!).origin;

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }
  // Removing certain issue causing headers
  headers.delete('connection');

  const clientUrl = new URL(req.url);
  const upstreamPath = params?.path
    ? `/api/${params.path.join('/')}`
    : clientUrl.pathname;
  const targetUrl = `${apiOrigin}${upstreamPath}${clientUrl.search}`;

  // Fetch Stream and pass directly in the body
  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    // @ts-ignore: Required for Node.js bi-directional streaming
    duplex: 'half',
  });

  const responseHeaders = new Headers(response.headers);

  // content compression should be handled by browser itself
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('connection');

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
}

export const GET = proxyRequest;

export const POST = proxyRequest;

export const PUT = proxyRequest;

export const DELETE = proxyRequest;

export const PATCH = proxyRequest;
