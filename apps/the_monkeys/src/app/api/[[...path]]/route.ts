import { cookies } from 'next/headers';

import { API_URL } from '@/constants/api';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const headers = new Headers(req.headers);

  const apiURL = new URL(API_URL!).origin;

  const response = await fetch(`${apiURL}${url.pathname}${url.search}`, {
    method: req.method,
    headers,
  });

  response.headers.delete('Content-Encoding');
  return response;
}

export async function POST(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const apiURL = new URL(API_URL!).origin;

  const responseHeaders = new Headers();
  const response = await fetch(`${apiURL}/api/${params.path.join('/')}`, {
    method: req.method,
    headers,
    body: req.body,
    //@ts-ignore
    duplex: 'half',
  });

  responseHeaders.set('Set-Cookie', response.headers.get('Set-Cookie') || '');
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function PUT(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const apiURL = new URL(API_URL!).origin;

  const responseHeaders = new Headers();
  const response = await fetch(`${apiURL}/api/${params.path.join('/')}`, {
    method: req.method,
    headers,
    body: req.body,
    //@ts-ignore
    duplex: 'half',
  });

  responseHeaders.set('Set-Cookie', response.headers.get('Set-Cookie') || '');
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: responseHeaders,
  });
}

export async function DELETE(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  const cookieStore = cookies();
  const authToken = cookieStore.get('mat');

  const headers = new Headers(req.headers);
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken.value}`);
  }

  const apiURL = new URL(API_URL!).origin;

  const responseHeaders = new Headers();
  const response = await fetch(`${apiURL}/api/${params.path.join('/')}`, {
    method: req.method,
    headers,
    body: req.body,
    //@ts-ignore
    duplex: 'half',
  });

  responseHeaders.set('Set-Cookie', response.headers.get('Set-Cookie') || '');
  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: responseHeaders,
  });
}
