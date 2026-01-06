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
  // Removing certain headers causing issues
  headers.delete('host');
  headers.delete('content-length');
  headers.delete('connection');

  let targetUrl = '';
  const clientUrl = new URL(req.url);

  // GET uses pathname, others use params.path construction
  if (params?.path) {
    targetUrl = `${apiOrigin}/api/${params.path.join('/')}${clientUrl.search}`;
  } else {
    targetUrl = `${apiOrigin}${clientUrl.pathname}${clientUrl.search}`;
  }

  // Fetch Stream and pass directly in the body
  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    // @ts-ignore: Required for Node.js streaming
    duplex: 'half',
  });

  // Response Headers
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

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}

export async function POST(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}

export async function PUT(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}

export async function DELETE(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(req, params);
}
